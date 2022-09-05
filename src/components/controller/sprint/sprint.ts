import IWords from "../../view/IWords";
import sprintView from "../../view/sprint/sprintView";
import crudApi from "../CRUD/CrudApi";
import { aggregatedWordsResponse } from "../../view/SectionTextbook";
// import preloader from "../../view/sprint/preloader";
import { updateStat } from "../statistic/updateStatistic";
import { IGameStore } from "../statistic/IStatisticStore";

type answer = {
  result: boolean;
  wordId: string;
};

class Sprint {
  private score = 0;
  private tries = 0;
  private maxInRow = 0;
  private words!: IWords[];
  private level = 0;
  private page!: number;
  private answers: answer[] = [];
  private count!: NodeJS.Timer;
  private currCard = {
    same: false,
    original: "",
    wordId: "",
    translate: "",
  };

  private getLevel() {
    const selectLevel = document.querySelector(
      ".inform-level__select"
    ) as HTMLSelectElement;
    return Number(selectLevel.value);
  }
  async getWord(wordId: string) {
    const word: IWords = await crudApi.getItem({
      endpoint: `/words/${wordId}`,
    });
    return `${word.word} - ${word.wordTranslate}`;
  }
  async startGame() {
    this.level = this.getLevel() - 1;
    this.page = this.pageRandomGeneration();
    // preloader
    await this.getWords();
    this.createRandomCard();
    this.startCountdown();
  }
  async startGameTextbook() {
    this.level = localStorage["sectionNumber"] - 1;
    this.page = localStorage["currentPage"]
      ? localStorage["currentPage"] - 1
      : 1;
    if (!localStorage["user"]) {
      await this.getWords();
    } else {
      await this.getAggregatedWords();
    }
    this.createRandomCard();
    this.startCountdown();
  }
  private async endGame() {
    this.collectInfoResult();
    document.onkeyup = null;
    await sprintView.renderEndScreen({
      score: this.score,
      answers: this.answers,
    });
    this.clearCountdown(this.count);
    this.score = 0;
    this.answers.length = 0;
    this.tries = 0;
    this.currCard = {
      same: false,
      original: "",
      wordId: "",
      translate: "",
    };
  }

  private async getWords() {
    const data: [IWords] = await crudApi.getItem({
      endpoint: "/words",
      options: {
        group: this.level,
        page: this.page,
      },
    });
    this.words = this.shuffle(data);
  }
  private async getAggregatedWords() {
    const user = JSON.parse(localStorage["user"]);
    const data: aggregatedWordsResponse[] = await crudApi.getItem(
      {
        endpoint: `/users/${user.userId}/aggregatedWords`,
        options: {
          group: this.level,
          wordsPerPage: 20,
          filter: `%7B%22%24and%22%3A%5B%7B%22%24or%22%3A%5B%7B%22userWord.optional.isLearned%22%3A%20false%7D%2C%7B%22userWord%22%3Anull%7D%5D%7D%2C%7B%22page%22%3A%20${this.page}%7D%5D%7D`,
        },
      },
      `${user.token}`
    );
    if (data[0]) {
      const words = this.shuffle(data[0].paginatedResults);
      if (words.length < 20 && this.page > 1) {
        this.page -= 1;
        await this.getAggregatedWords();
      } else {
        this.words = words;
      }
    }
  }
  private startCountdown() {
    sprintView.renderTimer();
    const timer = document.querySelector(".timer") as HTMLSpanElement;
    let countdownBegin = 30;
    this.count = setInterval(() => {
      if (countdownBegin <= 0) {
        this.clearCountdown(this.count);
        this.endGame();
      } else {
        countdownBegin -= 1;
        timer.innerHTML = String(countdownBegin);
      }
    }, 1000);
  }
  private clearCountdown(interval: NodeJS.Timer) {
    clearTimeout(interval);
  }
  private async createRandomCard() {
    if (this.answers.length >= this.words.length) {
      this.endGame();
    } else {
      const isSame = Math.floor(Math.random() * 1.9);
      this.currCard.same = !!isSame;
      const numOfWord = this.answers.length;
      if (isSame) {
        this.currCard.original = this.words[numOfWord]!.word;
        if (this.words[numOfWord]?.id) {
          this.currCard.wordId = this.words[numOfWord]!.id!;
        } else {
          this.currCard.wordId = this.words[numOfWord]!._id!;
        }
        this.currCard.translate = this.words[numOfWord]!.wordTranslate;
      } else {
        this.currCard.original = this.words[numOfWord]!.word;
        if (this.words[numOfWord]?.id) {
          this.currCard.wordId = this.words[numOfWord]!.id!;
        } else {
          this.currCard.wordId = this.words[numOfWord]!._id!;
        }
        this.currCard.translate =
          this.words[
            Math.floor(Math.random() * this.words.length)
          ]!.wordTranslate;
      }
      sprintView.renderCard({
        score: this.score,
        countOfTries: this.tries,
        original: this.currCard.original,
        translate: this.currCard.translate,
      });
      this.createButtonsEvent();
    }
  }
  private createButtonsEvent() {
    const buttonsWrapper = document.querySelector(
      ".buttons-wrapper"
    ) as HTMLDivElement;
    if (buttonsWrapper) {
      const buttons = buttonsWrapper.children;
      this.keyButtonsEvent();
      for (const i of buttons) {
        const el = i as HTMLElement;
        el.addEventListener("click", async () => {
          if (el.dataset["type"] === `${this.currCard.same}`) {
            this.buttonCorrectAction();
          } else {
            this.buttonIncorrectAction();
          }
        });
      }
    }
  }
  private keyButtonsEvent() {
    document.onkeyup = async (e) => {
      e = e || window.event;
      if (e.key === "ArrowUp") {
        if ("true" === `${this.currCard.same}`) {
          this.buttonCorrectAction();
        } else {
          this.buttonIncorrectAction();
        }
        document.onkeyup = null;
      } else if (e.key === "ArrowDown") {
        if ("false" === `${this.currCard.same}`) {
          this.buttonCorrectAction();
        } else {
          this.buttonIncorrectAction();
        }
        document.onkeyup = null;
      }
    };
  }
  private buttonCorrectAction() {
    if (this.answers.length < this.words.length) {
      this.answers.push({
        result: true,
        wordId: this.currCard.wordId,
        // wordName: this.currCard.original,
      });
      document.body.style.background = "green";
      setTimeout(() => {
        if (this.tries >= 3) {
          this.score += 20;
        } else {
          this.score += 10;
        }
        this.tries += 1;
        this.maxInRow = this.tries > this.maxInRow ? this.tries : this.maxInRow;
        document.body.style.background = "";
        this.createRandomCard();
      }, 500);
    } else {
      this.endGame();
    }
  }
  private async buttonIncorrectAction() {
    if (this.answers.length < this.words.length) {
      this.answers.push({
        result: false,
        wordId: this.currCard.wordId,
      });
      document.body.style.background = "red";
      setTimeout(() => {
        this.maxInRow = this.tries > this.maxInRow ? this.tries : this.maxInRow;
        this.tries = 0;
        this.createRandomCard();
        document.body.style.background = "";
      }, 500);
    } else {
      this.endGame();
    }
  }
  private pageRandomGeneration(): number {
    return Math.floor(Math.random() * 29);
  }
  private shuffle(arr: IWords[]) {
    const newArr = arr
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    return newArr;
  }
  collectInfoResult() {
    const sprint: IGameStore = {
      name: "sprint",
      arrayAllWord: [],
      points: 0,
      maxInRow: 0,
      trueAnswers: 0,
    };
    const trueWorlds = this.answers
      .filter((el) => el.result === true)
      .map((el) => el.wordId);
    sprint.arrayAllWord = trueWorlds;
    sprint.points = this.score;
    sprint.maxInRow = this.maxInRow;
    sprint.trueAnswers = trueWorlds.length;
    updateStat.updateStatisticGame(sprint);
  }
}
const sprint = new Sprint();
export default sprint;
