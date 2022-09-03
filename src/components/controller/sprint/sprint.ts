import IWords from "../../view/IWords";
import sprintView from "../../view/sprint/sprintView";
import crudApi from "../CRUD/CrudApi";

class Sprint {
  score = 0;
  tries = 0;
  words!: [IWords];
  level!: number;
  page!: number;
  answers: [{ result: boolean; wordId: string }] = [
    { result: true, wordId: "" },
  ];
  currCard = {
    same: true,
    original: "go",
    wordId: "id",
    translate: "Идти",
  };

  getLevel() {
    const selectLevel = document.querySelector(
      ".inform-level__select"
    ) as HTMLSelectElement;
    return Number(selectLevel.value);
  }

  async startGame() {
    this.level = this.getLevel();
    this.page = this.pageRandomGeneration();
    await this.getWords();
    // this.answers.pop();
    await sprintView.renderTimer();
    this.startCountdown();
    this.createRandomCard();
  }

  async endGame() {
    // TODO: EDIT
    const main = document.querySelector(".main") as HTMLDivElement;
    main.innerHTML = "Game Over";
  }

  async getWords() {
    const data: [IWords] = await crudApi.getItem({
      endpoint: "/words",
      options: {
        group: this.level,
        page: this.page,
      },
    });
    this.words = this.shuffle(data);
  }
  startCountdown() {
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
  clearCountdown(interval: NodeJS.Timer) {
    clearTimeout(interval);
  }
  async createRandomCard() {
    const isSame = Math.floor(Math.random() * 1.9);
    this.currCard.same = !!isSame;
    const numOfWord = this.answers.length - 1;
    if (isSame) {
      this.currCard.original = this.words[numOfWord]!.word;
      this.currCard.wordId = this.words[numOfWord]!.id!;
      this.currCard.translate = this.words[numOfWord]!.wordTranslate;
      console.log(numOfWord);
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
  createButtonsEvent() {
    const buttonsWrapper = document.querySelector(
      ".buttons-wrapper"
    ) as HTMLDivElement;
    if (buttonsWrapper) {
      const buttons = buttonsWrapper.children;
      if (this.answers.length < 20) {
        for (const i of buttons) {
          const el = i as HTMLElement;
          el.addEventListener("click", async () => {
            if (el.dataset["type"] === `${this.currCard.same}`) {
              this.buttonCorrectAction();
            } else {
              this.buttonIncorrectAction();
            }
            console.log(this.tries);
          });
        }
        this.keyButtonsEvent();
      }
    }
  }
  keyButtonsEvent() {
    document.onkeyup = async (e) => {
      e = e || window.event;
      if (e.key === "ArrowUp") {
        if ("true" === `${this.currCard.same}`) {
          await this.buttonCorrectAction();
        } else {
          this.buttonIncorrectAction();
        }
      } else if (e.key === "ArrowDown") {
        if ("false" === `${this.currCard.same}`) {
          await this.buttonCorrectAction();
        } else {
          this.buttonIncorrectAction();
        }
      }
    };
  }
  async buttonCorrectAction() {
    if (this.answers.length < 20) {
      this.answers.push({ result: true, wordId: this.currCard.wordId });
      document.body.style.background = "green";
      setTimeout(() => {
        if (this.tries === 3) {
          this.score += 20;
        } else {
          this.tries += 1;
          this.score += 10;
        }
        document.body.style.background = "";
        this.createRandomCard();
      }, 500);
    } else {
      this.endGame();
    }
  }
  async buttonIncorrectAction() {
    if (this.answers.length < 20) {
      this.answers.push({ result: true, wordId: this.currCard.wordId });
      document.body.style.background = "red";
      setTimeout(() => {
        this.tries = 0;
        this.createRandomCard();
        document.body.style.background = "";
      }, 500);
    } else {
      this.endGame();
    }
  }
  pageRandomGeneration(): number {
    return Math.floor(Math.random() * 29);
  }
  shuffle(arr: [IWords]) {
    arr
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    return arr;
  }
  // start game
  // get words
  // count score
  // final result
  // timers
  // tries
}
const sprint = new Sprint();
export default sprint;
