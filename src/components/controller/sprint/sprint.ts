import IWords from "../../view/IWords";
import sprintView from "../../view/sprint/sprintView";
import crudApi from "../CRUD/CrudApi";
type answer = {
  result: boolean;
  wordId: string;
};
class Sprint {
  score = 0;
  tries = 0;
  maxInRow = 0;
  words!: [IWords];
  level!: number;
  page!: number;
  answers: answer[] = [];
  currCard = {
    same: false,
    original: "",
    wordId: "",
    translate: "",
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
    sprintView.renderTimer();
    this.startCountdown();
    this.createRandomCard();
  }

  async endGame() {
    // TODO: EDIT
    const main = document.querySelector(".main") as HTMLDivElement;
    main.innerHTML = `${JSON.stringify(this.answers)}`;
    console.log("max in row: ", this.maxInRow);
    console.log("answers: ", this.answers);
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
  createRandomCard() {
    console.log(this.answers.length);
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
  createButtonsEvent() {
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
  keyButtonsEvent() {
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
  buttonCorrectAction() {
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
  async buttonIncorrectAction() {
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
