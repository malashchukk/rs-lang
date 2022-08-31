import crudApi from "../controller/CRUD/CrudApi";
import WordRender from "./wordRender";
import preloader from "./preloader";
import authorizedUser from "../controller/authorization/autorizatedUser";
import IWords from "./IWords";

export default class RenderTextbookWords extends WordRender {
  override async renderCards(
    where: HTMLDivElement,
    pageNumber = 0,
    groupNumber = 0
  ) {
    await this.createHTMLCards(where, pageNumber, groupNumber);
    preloader.init(where);
    this.addAudioEvent();
    this.addButtons();
    this.addButtonsEvents();
  }
  addButtonsEvents() {
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
      const user = JSON.parse(localStorage["user"]) as authorizedUser;
      const wordId = container.getAttribute("data-id");
      if (target.classList.contains("difficult-word")) {
        messageElement.style.display = "block";
        messageElement.innerHTML = "сложное";
        crudApi.createItem(
          { endpoint: `/users/${user.userId}/words/${wordId}` },
          {
            difficulty: "hard",
            optional: {
              guessCount: 0,
            },
          },
          user.token
        );
      } else {
        messageElement.style.display = "none";
        crudApi.deleteItem(
          {
            endpoint: `/users/${user.userId}/words/${wordId}`,
          },
          user.token
        );
      }
    };
    addToDifficultBtns.forEach((btn) => {
      btn.addEventListener("click", btnOnclick);
    });
  }
  addButtons() {
    const buttonsContainers = document.querySelectorAll(".words-buttons");
    buttonsContainers.forEach((container) => {
      const newButton = document.createElement("button");
      newButton.className = "add-to-difficult";
      newButton.innerText = "сложное";
      container.append(newButton);
    });
  }
  protected override async createHTMLCards(
    container: HTMLDivElement,
    pageNumber = 0,
    group = 0
  ) {
    let cardsHtml = ``;
    await crudApi
      .getItem({
        endpoint: "/words",
        options: { page: pageNumber, group: group },
      })
      .then((data) => {
        const words = data as IWords[];
        cardsHtml = words.reduce((acc, curr) => {
          this.checkWord(curr?.id as string);
          return (acc += this.createCard(curr));
        }, "");
      });
    container.innerHTML = cardsHtml;
    this.checkAuthorization();
  }
  checkWord(id: string) {
    if (localStorage["user"]) {
      crudApi
        .getItem(
          {
            endpoint: `/users/${
              JSON.parse(localStorage["user"]).userId
            }/aggregatedWords/${id}`,
            options: {
              wordsPerPage: 1,
              filter: JSON.stringify({
                $and: [
                  {
                    "userWord.difficulty": "hard",
                  },
                ],
              }),
            },
          },
          JSON.parse(localStorage["user"]).token
        )
        .then((data) => {
          const wordInfo = data as Array<IWords>;
          const idDifficultWord = wordInfo[0]?.userWord?.difficulty === "hard";
          if (idDifficultWord) {
            const difficultWordButton = document.querySelector(
              `[data-id="${id}"] .words-buttons .add-to-difficult`
            ) as HTMLButtonElement;
            const messageElement = document.querySelector(
              `[data-id="${wordInfo[0]?._id}"] .word-card__message`
            ) as HTMLDivElement;

            difficultWordButton?.classList.add("difficult-word");
            difficultWordButton.innerText = "простое";
            messageElement.style.display = "block";
            messageElement.innerText = "сложное";
            difficultWordButton.setAttribute(
              "wordid",
              wordInfo[0]?._id as string
            );
          }
        });
    }
  }
  update(isAuthorized: boolean) {
    const wordCardMessage = document.querySelectorAll(
      ".word-card__message"
    ) as NodeListOf<HTMLDivElement>;
    const wordCards = document.querySelectorAll(
      ".word-card"
    ) as NodeListOf<HTMLDivElement>;

    this.showDifficulty(isAuthorized);
    if (isAuthorized) {
      wordCards.forEach((wordCard) => {
        const wordId = wordCard.getAttribute("data-id") as string;
        this.checkWord(wordId);
      });
    } else {
      wordCardMessage.forEach((message) => (message.style.display = "none"));
    }
  }
  showDifficulty(boolean: boolean) {
    const wordsButtons = document.querySelectorAll(
      ".words-buttons"
    ) as NodeListOf<HTMLButtonElement>;
    const wordCards = document.querySelectorAll(
      ".word-card"
    ) as NodeListOf<HTMLDivElement>;

    const displayStyle = boolean ? "flex" : "none";

    if (localStorage["isDifficultySection"]) {
      wordCards.forEach((card) => {
        card.style.display = displayStyle;
      });
    }
    wordsButtons.forEach((btn) => {
      btn.style.display = displayStyle;
    });
  }
}
