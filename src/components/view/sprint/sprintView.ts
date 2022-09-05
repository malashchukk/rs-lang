import sprint from "../../controller/sprint/sprint";
import preloader from "./preloader";
type answer = {
  wordId: string;
  result: boolean;
};
class SprintView {
  renderCard(options: {
    isSame?: boolean;
    score: number;
    countOfTries: number;
    original: string;
    translate: string;
  }) {
    // const main = document.querySelector(".main") as HTMLDivElement;
    // sprintWrapper.classList.add("sprint-game-wrapper");
    const html = `
      <p class="sprint-game__score" id="score">${options.score}</p>
      <div class="card">
        <div class="card__timer"></div>
        <div class="tries">
          <div class="tries__circle inactive" id="first"></div>
          <div class="tries__circle inactive" id="second"></div>
          <div class="tries__circle inactive" id="third"></div>
        </div>
        <div class="words">
          <p class="words__original">${options.original}</p>
          <p class="words__translate">${options.translate}</p>
        </div>
        <div class="buttons-wrapper">
          <button data-type="true" class="buttons-wrapper__button correct">Верно</button>
          <button data-type="false" class="buttons-wrapper__button incorrect">Неверно</button>
        </div>
      </div>
    `;
    const sprintOldWrapper = document.querySelector(".sprint-game-wrapper");
    const main = document.querySelector(".main") as HTMLDivElement;
    let sprintWrapper;
    if (!sprintOldWrapper) {
      // console.log("new");
      sprintWrapper = this.createBasicLayout();
      // main?.append
      main.replaceChildren(sprintWrapper);
    }
    sprintWrapper = document.querySelector(
      ".sprint-game-wrapper"
    ) as HTMLDivElement;
    const sprintGame = document.createElement("div");
    sprintGame.classList.add("sprint-game");
    sprintGame.innerHTML = `${html}`;
    const oldSprintGame = document.querySelector(
      ".sprint-game"
    ) as HTMLDivElement;
    if (oldSprintGame) {
      oldSprintGame.replaceWith(sprintGame);
    } else {
      // this.renderTimer();
      sprintWrapper.append(sprintGame);
    }

    const tries: NodeListOf<HTMLElement> =
      sprintWrapper.querySelectorAll(".tries__circle");
    for (let i = 0; i !== options.countOfTries; i += 1) {
      tries[i]?.classList.remove("inactive");
      tries[i]?.classList.add("active");
    }
    preloader.hideInHtml();
  }
  renderTimer() {
    const sprintWrapper = document.querySelector(
      ".sprint-game-wrapper"
    ) as HTMLDivElement;
    const timerWrapper = document.createElement("div");
    timerWrapper.classList.add("timer-wrapper");
    const html = `
      <svg width="200" height="200">
        <circle class="circle" cx="100" cy="100" r="80"  />
      </svg>
      <span class="timer">30</span>
    `;
    timerWrapper.innerHTML += html;
    sprintWrapper.append(timerWrapper);
  }
  private createBasicLayout() {
    const sprintWrapper = document.createElement("div");
    sprintWrapper.classList.add("sprint-game-wrapper");
    return sprintWrapper;
  }
  renderEndScreen(options: { score: number; answers: answer[] }) {
    const sprintWrapper = document.querySelector(
      ".sprint-game-wrapper"
    ) as HTMLDivElement;
    const incorrectAnswers = options.answers.filter(
      (el) => el.result === false
    );
    const correctAnswers = options.answers.filter((el) => el.result === true);
    let incorrectAnswersHTML = "";
    incorrectAnswers.forEach((el) => {
      incorrectAnswersHTML += `<li>${el.wordId}</li>`;
      return `<li class="answer">${el.wordId}</li>`;
    });
    let correctAnswersHTML = "";
    correctAnswers.forEach((el) => {
      correctAnswersHTML += `<li>${el.wordId}</li>`;
      return `<li class="answer">${el.wordId}</li>`;
    });
    const html = `
    <div class="end-screen">
      <p class="score">${options.score}</p>
      <div class="answers">
        <div class="answers__incorrect"><ul>${incorrectAnswersHTML}</ul></div>
        <div class="answers__correct"><ul>${correctAnswersHTML}</ul></div>
      </div>
      <a href="/#/home" class="close-btn">Выйти</a>
    </div>
    `;
    sprintWrapper.innerHTML = html;
    preloader.hideInHtml();
  }
  renderStartScreen() {
    const main = document.querySelector("main");
    const sprintWrapper = this.createBasicLayout();
    // const sprintWrapper = document.createElement("div");
    // sprintWrapper.classList.add("sprint-game-wrapper");
    const html = `
    <div class="timer-wrapper"></div>
    <div class="sprint-game">
      <h2 class="sprint-game__title">Спринт</h2>
      <p class="sprint-game__description">Тренировка Спринт поможет тебе проверить знаешь ли ты правильный перевод слов.
       </p>
      <p class="sprint-game__rules"> Играй пока не закончаться слова или время. </br> Чтобы играть с помощью клавиатуры нажимай стрелочками вверх-вниз</p>
      <div class="inform-level">
        <div class="inform-level__text">
          Выбери уровень сложности:
        </div>
        <select name="level" id="level" class="inform-level__select">
          <option value="1" selected>1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <button class="sprint-game__start-btn" id="startSprintGame">Начать</button>
    </div>`;
    sprintWrapper.innerHTML = html;
    main?.replaceChildren(sprintWrapper);

    const startButton = document.getElementById("startSprintGame");
    startButton?.addEventListener("click", () => {
      const sprintWrapper = document.querySelector(".main") as HTMLDivElement;
      preloader.init(sprintWrapper);
      sprint.startGame();
    });
  }
}
const sprintView = new SprintView();

export default sprintView;
