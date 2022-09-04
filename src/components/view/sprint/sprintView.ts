import sprint from "../../controller/sprint/sprint";

class SprintView {
  renderCard(options: {
    isSame?: boolean;
    score: number;
    countOfTries: number;
    original: string;
    translate: string;
  }) {
    const main = document.querySelector(".main") as HTMLDivElement;
    const sprintWrapper = document.createElement("div");
    sprintWrapper.classList.add("sprint-game-wrapper");
    const html = `
    <div class="timer-wrapper"></div>
    <div class="sprint-game">
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
    </div>
    `;
    sprintWrapper.innerHTML = `${html}`;
    main.replaceChildren(sprintWrapper);
    const tries: NodeListOf<HTMLElement> =
      sprintWrapper.querySelectorAll(".tries__circle");
    for (let i = 0; i !== options.countOfTries; i += 1) {
      tries[i]?.classList.remove("inactive");
      tries[i]?.classList.add("active");
    }
    this.renderTimer();
  }
  renderTimer() {
    const timerWrapper = document.querySelector(
      ".timer-wrapper"
    ) as HTMLDivElement;
    const html = `
      <svg width="200" height="200">
        <circle class="circle" cx="100" cy="100" r="80"  />
      </svg>
      <span class="timer">30</span>
    `;
    timerWrapper.innerHTML += html;
  }
  renderStartScreen() {
    const main = document.querySelector("main");
    const sprintWrapper = document.createElement("div");
    sprintWrapper.classList.add("sprint-game-wrapper");
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
    startButton?.addEventListener("click", () => sprint.startGame());
  }
}
const sprintView = new SprintView();

export default sprintView;
