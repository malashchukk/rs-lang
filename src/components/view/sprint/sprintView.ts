import sprint from "../../controller/sprint/sprint";

class SprintView {
  renderCard() {
    const sprintGame = document.querySelector(".sprint-game") as HTMLDivElement;
    const html = `
    <p class="sprint-game__score" id="score"></p>
      <div class="card">
        <div class="card__timer"></div>
        <div class="tries">
          <div class="tries__circle inactive" id="first"></div>
          <div class="tries__circle inactive" id="second"></div>
          <div class="tries__circle inactive" id="third"></div>
        </div>
        <div class="words">
          <p class="words__original"></p>
          <p class="words__translate"></p>
        </div>
        <div class="buttons-wrapper">
          <button class="buttons-wrapper__button correct"> &#8592 Верно</button>
          <button class="buttons-wrapper__button incorrect">Неверно &#8594</button>
        </div>
      </div>
    `;
    sprintGame.innerHTML = `${html}`;
  }
  renderStartScreen() {
    const main = document.querySelector("main");
    const sprintWrapper = document.createElement("div");
    sprintWrapper.classList.add("sprint-game");
    const html = `
      <h2 class="sprint-game__title">Спринт</h2>
      <p class="sprint-game__description">Тренировка Спринт поможет тебе проверить знаешь ли ты правильный перевод слов.
       </p>
      <p class="sprint-game__rules"> Играй пока не закончаться слова или время. </br> Чтобы играть с помощью клавиатуры нажимай стрелочками право-лево</p>
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
          <option value="6">6</option>
        </select>
      </div>
      <button class="sprint-game__start-btn" id="startSprintGame">Начать</button>
      `;
    sprintWrapper.innerHTML = html;
    main?.replaceChildren(sprintWrapper);

    const startButton = document.getElementById("startSprintGame");
    startButton?.addEventListener("click", sprint.getWords);
  }
}
const sprintView = new SprintView();

export default sprintView;
