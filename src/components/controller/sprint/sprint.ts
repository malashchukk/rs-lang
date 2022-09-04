import IWords from "../../view/IWords";
import sprintView from "../../view/sprint/sprintView";
import crudApi from "../CRUD/CrudApi";
type answer = {
  result: boolean;
  wordId: string;
};
class Sprint {
  private score = 0;
  private tries = 0;
  private maxInRow = 0;
  private words!: [IWords];
  private level!: number;
  private page!: number;
  private answers: answer[] = [];
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
  private async linkChangeAction() {
    await this.endGame();
  }
  async startGame() {
    this.level = this.getLevel();
    this.page = this.pageRandomGeneration();
    await this.getWords();
    sprintView.renderTimer();
    this.createRandomCard();
    this.startCountdown();
  }
  async startGameTextbook() {
    this.level = localStorage["group"];
    this.page = localStorage["page"];
    await this.getWords();
    this.createRandomCard();
    this.startCountdown();
  }
  private async endGame() {
    // TODO: EDIT
    this.score = 0;
    this.answers.length = 0;
    this.tries = 0;
    this.currCard = {
      same: false,
      original: "",
      wordId: "",
      translate: "",
    };
    const main = document.querySelector(".main") as HTMLDivElement;
    main.innerHTML = `${JSON.stringify(this.answers)}`;
    console.log("max in row: ", this.maxInRow);
    console.log("answers: ", this.answers);
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
  private startCountdown() {
    window.addEventListener("popstate", this.linkChangeAction.bind(this), {
      once: true,
    });
    const timer = document.querySelector(".timer") as HTMLSpanElement;
    let countdownBegin = 30;
    const count = setInterval(() => {
      if (countdownBegin <= 0) {
        this.clearCountdown(count);
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
  private createRandomCard() {
    if (this.answers.length >= 20) {
      this.createButtonsEvent();
      return;
    }
    const isSame = Math.floor(Math.random() * 1.9);
    this.currCard.same = !!isSame;
    const numOfWord = this.answers.length;
    if (isSame) {
      this.currCard.original = this.words[numOfWord]!.word;
      this.currCard.wordId = this.words[numOfWord]!.id!;
      this.currCard.translate = this.words[numOfWord]!.wordTranslate;
      console.log(this.currCard);
    } else {
      this.currCard.original = this.words[numOfWord]!.word;
      this.currCard.wordId = this.words[numOfWord]!.id!;
      this.currCard.translate =
        this.words[
          Math.floor(Math.random() * this.words.length)
        ]!.wordTranslate;
      console.log(this.currCard);
    }
    sprintView.renderCard({
      score: this.score,
      countOfTries: this.tries,
      original: this.currCard.original,
      translate: this.currCard.translate,
    });
    this.createButtonsEvent();
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
    if (this.answers.length < 20) {
      this.answers.push({ result: true, wordId: this.currCard.wordId });
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
    if (this.answers.length < 20) {
      this.answers.push({ result: false, wordId: this.currCard.wordId });
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
  private shuffle(arr: [IWords]) {
    arr
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    return arr;
  }
  // final result
}
const sprint = new Sprint();
export default sprint;
