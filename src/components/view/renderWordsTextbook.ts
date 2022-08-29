import crudApi from "../controller/CRUD/CrudApi";
import WordRender from "./wordRender";
import preloader from "./preloader";
import authorizedUser from "../controller/authorization/autorizatedUser";

export default class RenderTextbookWords extends WordRender {
  override async renderCards(
    where: HTMLDivElement,
    pageNumber = 0,
    groupNumber = 0
  ) {
    await this.htmlCards(where, pageNumber, groupNumber);
    preloader.show(
      document.querySelector(".textbook__words-wrapper") as HTMLDivElement
    );
    preloader.hide(
      document.querySelector(".textbook__words-wrapper") as HTMLDivElement
    );
    this.addAudioEvent();
    this.addButtons();
    this.addButtonsEvents();
  }
  private addButtonsEvents() {
    const addToDifficultBtns = document.querySelectorAll(".add-to-difficult");
    const btnOnclick = (event: Event) => {
      const target = event.currentTarget as HTMLButtonElement;
      const container = target.closest(".word-card-main") as HTMLDivElement;
      const messageElement = document.querySelector(
        `[data-id="${container.getAttribute("data-id")}"] .word-card__message`
      ) as HTMLDivElement;

      target.innerHTML =
        target.innerHTML.trim() === "сложное" ? "простое" : "сложное";
      target.classList.toggle("difficult-word");

      if (target.classList.contains("difficult-word")) {
        messageElement.style.display = "block";
        messageElement.innerHTML = "сложное";
        const user = JSON.parse(localStorage["user"]) as authorizedUser;
        const wordId = container.getAttribute("data-id");
        crudApi
          .createItem(
            { endpoint: `/users/${user.userId}/words/${wordId}` },
            {
              difficulty: "hard",
              optional: {
                guessCount: 0,
              },
            },
            user.token
          )
          .then((data) => console.log(data));
      } else {
        messageElement.style.display = "none";
      }
    };
    addToDifficultBtns.forEach((btn) => {
      btn.addEventListener("click", btnOnclick);
    });
  }
  private addButtons() {
    const buttonsContainers = document.querySelectorAll(".words-buttons");
    buttonsContainers.forEach((container) => {
      const newButton = document.createElement("button");
      newButton.className = "add-to-difficult";
      newButton.innerText = "сложное";
      container.append(newButton);
    });
  }
}
