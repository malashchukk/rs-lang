import crudApi from "../CRUD/CrudApi";
import { mainView } from "../../view/main/main";
import { audioCallView } from "../../view/audioCall/audioCallView";
import IWords from "../../view/IWords";
import { updateStat } from "../statistic/updateStatistic";
import { IGameStore } from "../statistic/IStatisticStore";
import { addInApi, idAfterGame } from "../learnWord";
import { IearnWord } from "../learnWord";

class AudioCallController {
  private progressWidth = 0;
  private progressStep = 5;
  idKeypress: string | undefined = "";
  level = 0;
  page = 0;
  maxInRow = 0;
  inRow = 0;
  arrId: idAfterGame[] = [];
  arrIdForStat: string[] = [];
  private arrWordsRus: string[] = [];
  private countNumberWord = 0;
  arrTrueAnswer: string[] = [];
  arrFalseAnswer: string[] = [];
  private ev1 = (event: KeyboardEvent) => {
    this.keyPress(event, this.idKeypress);
  };
  private reserveArr: string[] = [
    "хобби",
    "больница",
    "дверь",
    "команда",
    "нога",
    "животное",
    "желание",
    "возможность",
    "нетерпимость",
    "обнимать",
    "оплата",
    "компромисс",
    "невинность",
    "скорость",
    "бремя",
  ];

  startGame(comeIn: string, level = this.level, page = this.page) {
    this.arrWordsRus.length = 0;
    this.progressWidth = 0;
    this.arrTrueAnswer = [];
    this.arrFalseAnswer = [];
    this.countNumberWord = 0;
    this.inRow = 0;
    this.arrIdForStat = [];
    this.arrId = [];
    this.arrIdForStat = [];
    if (comeIn === "book") {
      this.level = level;
      this.page = page;
    }
    this.initAudioCallGame(comeIn);
  }

  async initAudioCallGame(comeIn: string) {
    if (this.countNumberWord < 20) {
      this.arrWordsRus.length = 0;

      const myDataWords = await crudApi.getItem<IWords[]>({
        endpoint: `/words?group=${this.level}&page=${this.page}`,
      });

      const { id, word, audio, image, wordTranslate } = myDataWords[
        this.countNumberWord
      ] as IWords;

      this.idKeypress = id;

      if (comeIn === "book" && (await this.isLearned(id))) {
        this.countNumberWord += 1;
        this.initAudioCallGame(comeIn);
      } else {
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
            this.giveAnswer(wordTranslate, word, targetParent, id);
          }
        });

        const gameBtn = document.querySelector(
          ".game .game__btn.button"
        ) as HTMLElement;
        gameBtn.addEventListener("click", (event) => {
          if ((event.target as HTMLElement).outerText === "Не знаю") {
            this.showAnswerIfClickDontKnow(wordTranslate, word, id);
            this.countNumberWord += 1;
          } else {
            document.removeEventListener("keyup", this.ev1);
            this.initAudioCallGame(comeIn);
          }
        });
        const progressBarTop = document.querySelector(
          ".game_progress"
        ) as HTMLElement;

        progressBarTop.style.width = `${this.progressWidth}%`;
        const audioBtn = document.querySelector(".game__voice") as HTMLElement;
        audioBtn.addEventListener("click", () => {
          this.createAudio(`https://rslang-malashchukk.herokuapp.com/${audio}`);
        });

        window.addEventListener("keyup", this.ev1);
        this.listenerCloseBtn();
      }
    } else if (this.arrId.length < 20) {
      this.page += 1;
      this.countNumberWord = this.arrId.length;
      this.initAudioCallGame(comeIn);
    } else {
      const point = this.arrTrueAnswer.length * 10;
      const percent = (this.arrTrueAnswer.length / 20) * 100;
      audioCallView.showResultGame(point, percent);

      const btnCloseBtn = document.querySelector(
        ".close_result_game"
      ) as HTMLElement;
      btnCloseBtn.addEventListener("click", () => {
        this.collectInfoResult(point);
      });
    }
  }

  async isLearned(id?: string) {
    const isWord = await crudApi
      .getItem(
        {
          endpoint: `/users/${
            JSON.parse(localStorage["user"]).userId
          }/words/${id}`,
        },
        JSON.parse(localStorage["user"]).token
      )
      .then((res) => {
        return (res as IearnWord).optional.isLearned ? true : false;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });

    return isWord;
  }
  collectInfoResult(point: number) {
    this.page = this.page > 20 ? 0 : this.page + 1;
    audioCallView.clearMainFooter("block");
    mainView.showMain();

    const audioCall: IGameStore = {
      name: "audioCall",
      arrayAllWord: [],
      points: 0,
      maxInRow: 0,
      trueAnswers: 0,
    };
    audioCall.arrayAllWord = [...this.arrIdForStat];

    audioCall.points = point;
    audioCall.trueAnswers = this.arrTrueAnswer.length;
    audioCall.maxInRow = this.maxInRow;

    if (localStorage["user"]) {
      addInApi.addWord(this.arrId);
      updateStat.updateStatisticGame(audioCall);
    }
  }

  listenerCloseBtn() {
    const close = document.querySelector(".close_btn") as HTMLElement;
    close.addEventListener("click", () => {
      mainView.showMain();
      audioCallView.clearMainFooter("block");
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

  giveAnswer(
    wordTranslate: string,
    word: string,
    event: HTMLElement,
    id?: string | undefined
  ) {
    const gameBtn = document.querySelector(".game__btn") as HTMLElement;
    const getWordRusText = (event.lastElementChild as HTMLElement).innerHTML;
    const allWords = document.querySelectorAll(".words__item");
    const imgAnswer = document.querySelector(
      ".container_audioCall"
    ) as HTMLElement;

    this.progressGame();

    imgAnswer.classList.add("active");
    const countRow = this.arrTrueAnswer.length;
    if (getWordRusText === wordTranslate) {
      this.arrTrueAnswer.push(word);
      if (id) {
        this.arrIdForStat.push(id);
        this.arrId.push([id, true]);
      }

      this.createAudio("../../assets/audio/audio_correct.mp3");

      allWords.forEach((element) => {
        element.classList.remove("true");
        element.classList.add("false");
      });
      event.classList.remove("false");
      event.classList.add("true");
    } else {
      this.arrFalseAnswer.push(word);
      if (id) {
        this.arrIdForStat.push(id);
        this.arrId.push([id, false]);
      }

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
    this.calculateRow(countRow);
    gameBtn.innerText = "Далее";
  }

  calculateRow(oldCount: number) {
    const newCountRow = this.arrTrueAnswer.length;
    if (oldCount + 1 === newCountRow) {
      this.inRow += 1;
      this.maxInRow = this.inRow > this.maxInRow ? this.inRow : this.maxInRow;
    } else {
      this.inRow = 0;
    }
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

  showAnswerIfClickDontKnow(
    wordTranslate: string,
    word: string,
    id?: string | undefined
  ) {
    const gameBtn = document.querySelector(".game__btn") as HTMLElement;
    const allWords = document.querySelectorAll(".words__item");
    const imgAnswer = document.querySelector(
      ".container_audioCall"
    ) as HTMLElement;

    imgAnswer.classList.add("active");
    if (id) {
      this.arrId.push([id, false]);
      this.arrIdForStat.push(id);
    }

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

  keyPress(event: KeyboardEvent, id: string | undefined) {
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
      document.removeEventListener("keyup", this.ev1);
      this.initAudioCallGame("main");
    }

    if (!game.classList.contains("active")) {
      gameNumber.forEach((number) => {
        if ((<HTMLElement>number.firstElementChild).outerText === keyUp) {
          this.countNumberWord += 1;
          this.giveAnswer(wordTranslate, word, number, id);
        } else if (keyUp === " " && gameBtn.outerText === "Не знаю") {
          this.showAnswerIfClickDontKnow(wordTranslate, word, id);
          this.countNumberWord += 1;
        }
      });
    }
  }
}
export const gameController = new AudioCallController();
