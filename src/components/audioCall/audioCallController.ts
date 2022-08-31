import "./audioCallStyle.scss";
import crudApi from "../controller/CRUD/CrudApi";
import { Main } from "../main/main";
import { audioCallView } from "./audioCallView";
import { wordOne } from "./type";

class AudioCallController {
  private progressWidth = 0;
  private progressStep = 5;
  level = 0;
  page = 0;
  private myDataWords: wordOne[] = [];
  private arrWordsRus: string[] = [];
  private countNumberWord = 0;
  arrTrueAnswer: string[] = [];
  arrFalseAnswer: string[] = [];
  private reserveArr: string[] = [
    "хобби",
    "больница",
    "дверь",
    "команда",
    "нога",
    "животное",
    "желание",
    "оплата",
    "компромисс",
    "невинность",
    "скорость",
    "бремя",
  ];

  async initAudioCallGame() {
    console.log("initAudioCallGame");
    if (this.countNumberWord < 20) {
      this.arrWordsRus.length = 0;
      this.myDataWords = await crudApi.getItem<wordOne[]>({
        endpoint: `/words?group=${this.level}&page=${this.page}`,
      });

      const word: string | undefined =
        this.myDataWords[this.countNumberWord]?.word;
      const audio: string | undefined =
        this.myDataWords[this.countNumberWord]?.audio;
      const image: string | undefined =
        this.myDataWords[this.countNumberWord]?.image;
      const wordTranslate: string | undefined =
        this.myDataWords[this.countNumberWord]?.wordTranslate;

      if (word && audio && image && wordTranslate) {
        this.arrWordsRus.push(wordTranslate);
        this.createArrayRusWord();
        audioCallView.renderGamePage(
          this.arrWordsRus,
          word,
          audio,
          image,
          wordTranslate
        );

        const gameWords = document.querySelector(".game__words") as HTMLElement;
        gameWords.addEventListener("click", (event) => {
          const targetParent = (event.target as HTMLElement)
            .parentElement as HTMLElement;
          if ((targetParent as HTMLElement).className === "words__item") {
            gameWords.classList.add("active");
            this.countNumberWord += 1;
            this.giveAnswer(wordTranslate, word, targetParent);
          }
        });

        const gameBtn = document.querySelector(
          ".game .game__btn.button"
        ) as HTMLElement;
        gameBtn.addEventListener("click", (event) => {
          if ((event.target as HTMLElement).outerText === "Не знаю") {
            this.showAnswerIfClickDontKnow(wordTranslate, word);
            this.countNumberWord += 1;
          } else {
            this.initAudioCallGame();
          }
        });
      }

      const progressBarTop = document.querySelector(
        ".game_progress"
      ) as HTMLElement;
      progressBarTop.style.width = `${this.progressWidth}%`;

      const audioBtn = document.querySelector(".game__voice") as HTMLElement;
      audioBtn.addEventListener("click", () => {
        this.createAudio(`https://rslang-malashchukk.herokuapp.com/${audio}`);
      });

      window.addEventListener("keyup", (event) => {
        this.keyPress(event);

        // document.removeEventListener('keyup', ()=> {
        //     this.keyPress(event)
        // })
      });

      this.listenerCloseBtn();
    } else {
      audioCallView.showResultGame();
      const btnCloseBtn = document.querySelector(
        ".close_result_game"
      ) as HTMLElement;
      btnCloseBtn.addEventListener("click", () => {
        const mainPage = new Main();
        mainPage.showMain();
      });
    }
  }

  listenerCloseBtn() {
    console.log("listenerCloseBtn");
    const close = document.querySelector(".close_btn") as HTMLElement;
    close.addEventListener("click", () => {
      const mainPage = new Main();
      mainPage.showMain();
    });
  }

  getLevel() {
    const selectLevel = document.querySelector(
      ".lvl-select"
    ) as HTMLSelectElement;
    this.level = +selectLevel.value - 1;
  }

  createAudio(way: string) {
    const audioElement = new Audio(way);
    audioElement.play();
  }

  giveAnswer(wordTranslate: string, word: string, event: HTMLElement) {
    const gameBtn = document.querySelector(".game__btn") as HTMLElement;
    const getWordRusText = (event.lastElementChild as HTMLElement).innerHTML;
    const allWords = document.querySelectorAll(".words__item");
    const imgAnswer = document.querySelector(
      ".container_audioCall"
    ) as HTMLElement;

    this.progressGame();

    imgAnswer.classList.add("active");

    if (getWordRusText === wordTranslate) {
      this.arrTrueAnswer.push(word);
      this.createAudio("../../assets/audio/audio_correct.mp3");

      allWords.forEach((element) => {
        element.classList.remove("true");
        element.classList.add("false");
      });
      event.classList.remove("false");
      event.classList.add("true");
    } else {
      this.arrFalseAnswer.push(word);
      this.createAudio("../../../assets/audio/audio_error.mp3");

      allWords.forEach((element) => {
        element.classList.add("false");
        if (
          wordTranslate === (<HTMLElement>element.lastElementChild).outerText
        ) {
          element.classList.add("true");
        }
      });
      event.classList.add("line-through");
    }
    gameBtn.innerText = "Далее";
  }

  createArrayRusWord() {
    const countOtherRusWord = 4;
    this.randomSort(this.reserveArr);
    this.reserveArr.forEach((e) => this.arrWordsRus.push(e));
    this.arrWordsRus = this.arrWordsRus.slice(0, countOtherRusWord + 1);
    this.randomSort(this.arrWordsRus);
  }

  randomSort(array: string[]) {
    array.sort(() => Math.random() - 0.5);
  }

  progressGame() {
    this.progressWidth += this.progressStep;
    const progressBarTop = document.querySelector(
      ".game_progress"
    ) as HTMLElement;
    progressBarTop.style.width = `${this.progressWidth}%`;
  }

  showAnswerIfClickDontKnow(wordTranslate: string, word: string) {
    const gameBtn = document.querySelector(".game__btn") as HTMLElement;
    const allWords = document.querySelectorAll(".words__item");
    const imgAnswer = document.querySelector(
      ".container_audioCall"
    ) as HTMLElement;

    imgAnswer.classList.add("active");
    this.arrFalseAnswer.push(word);
    this.progressGame();

    allWords.forEach((e) => {
      e.classList.add("false");
      if (wordTranslate === (<HTMLElement>e.lastElementChild).outerText) {
        e.classList.add("true");
      }
    });
    this.createAudio("../../../assets/audio/audio_error.mp3");
    gameBtn.innerText = "Далее";
  }

  keyPress(event: KeyboardEvent) {
    const word = (document.querySelector(".game__word") as HTMLElement)
      .outerText;
    const wordTranslate = (
      document.querySelector(".game__word_rus") as HTMLElement
    ).outerText;
    const gameNumber = document.querySelectorAll(
      ".words__item"
    ) as NodeListOf<HTMLElement>;
    const keyUp = event.key;
    const gameBtn = document.querySelector(
      ".game .game__btn.button"
    ) as HTMLElement;
    const game = document.querySelector(".container_audioCall") as HTMLElement;

    if (keyUp === " " && gameBtn.outerText === "Далее") {
      this.initAudioCallGame();
    }

    if (!game.classList.contains("active")) {
      gameNumber.forEach((number) => {
        if ((<HTMLElement>number.firstElementChild).outerText === keyUp) {
          this.countNumberWord += 1;
          this.giveAnswer(wordTranslate, word, number);
        } else if (keyUp === " " && gameBtn.outerText === "Не знаю") {
          this.showAnswerIfClickDontKnow(wordTranslate, word);
          this.countNumberWord += 1;
        }
      });
    }
  }
}
export const gameController = new AudioCallController();
