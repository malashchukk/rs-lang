import crudApi from "../controller/CRUD/CrudApi";
import WordRender from "./wordRender";
import preloader from "./preloader";
import authorizedUser from "../controller/authorization/autorizatedUser";
import IWords from "./IWords";

export default class RenderTextbookWords extends WordRender {
  learnedCount = 0;
  override async renderCards(
    where: HTMLDivElement,
    pageNumber = 0,
    groupNumber = 0
  ) {
    this.learnedCount = 0;
    await this.createHTMLCards(where, pageNumber, groupNumber);
    preloader.init(where);
    this.addAudioEvent();
    this.addButtons();
    this.addButtonsEvents();
  }
  checkCountLearnedWords(container: HTMLDivElement) {
    const addToDifficultBtn = document.querySelector(
      `[data-id="${container.getAttribute(
        "data-id"
      )}"] .words-buttons .add-to-difficult`
    ) as HTMLButtonElement;
    const addToLearnedBtn = document.querySelector(
      `[data-id="${container.getAttribute(
        "data-id"
      )}"] .words-buttons .add-to-learned`
    ) as HTMLButtonElement;
    const wrapper = document.querySelector(
      ".textbook__words-wrapper"
    ) as HTMLDivElement;
    const currentPageBtn = document.querySelector(
      ".page-btn.active"
    ) as HTMLButtonElement;
    if (
      addToDifficultBtn.classList.contains("difficult-word") ||
      addToLearnedBtn.classList.contains("learned-word")
    ) {
      this.learnedCount += 1;
      if (this.learnedCount === 20) {
        currentPageBtn.style.background = "green";
        wrapper.style.boxShadow = "0px 0px 30px green ";
      }
    } else {
      currentPageBtn.style.background = "#ddd";
      this.learnedCount -= 1;
      wrapper.style.boxShadow = "none";
    }
  }
  settleEvent(
    target: HTMLButtonElement,
    messageElement: HTMLDivElement,
    container: HTMLDivElement,
    difficulty: string,
    isLearned: boolean
  ) {
    const addToDifficultBtn = document.querySelector(
      `[data-id="${container.getAttribute(
        "data-id"
      )}"] .words-buttons .add-to-difficult`
    ) as HTMLButtonElement;
    const addToLearnedBtn = document.querySelector(
      `[data-id="${container.getAttribute(
        "data-id"
      )}"] .words-buttons .add-to-learned`
    ) as HTMLButtonElement;
    this.checkCountLearnedWords(container);

    const user = JSON.parse(localStorage["user"]) as authorizedUser;
    const wordId = container.getAttribute("data-id");
    messageElement.innerHTML = difficulty === "hard" ? "сложное" : "изученное";

    crudApi.updateItems(
      { endpoint: `/users/${user.userId}/words/${wordId}` },
      {
        difficulty: difficulty,
        optional: {
          guessCount: 0,
          isLearned: isLearned,
        },
      },
      user.token
    );
    if (
      container.classList.contains("difficult") ||
      container.classList.contains("learned")
    ) {
      messageElement.style.display = "block";
      crudApi.createItem(
        { endpoint: `/users/${user.userId}/words/${wordId}` },
        {
          difficulty: difficulty,
          optional: {
            guessCount: 0,
            isLearned: isLearned,
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
    if (addToLearnedBtn === target) {
      addToDifficultBtn.classList.remove("difficult-word");
      addToDifficultBtn.innerText = "сложное";
      container.classList.remove("difficult");
    } else {
      addToLearnedBtn.classList.remove("learned-word");
      addToLearnedBtn.innerText = "изученное";
      container.classList.remove("learned");
    }
  }
  addButtonsEvents() {
    const addToDifficultBtns = document.querySelectorAll(".add-to-difficult");
    const addToLearnedBtns = document.querySelectorAll(".add-to-learned");
    const btnOnclick = (event: Event) => {
      const target = event.currentTarget as HTMLButtonElement;
      const container = target.closest(".word-card-main") as HTMLDivElement;
      const messageElement = document.querySelector(
        `[data-id="${container.getAttribute("data-id")}"] .word-card__message`
      ) as HTMLDivElement;

      if (target.classList.contains("add-to-learned")) {
        target.innerHTML =
          target.innerHTML.trim() === "изученное" ? "не изученое" : "изученное";
        container.classList.toggle("learned");
        target.classList.toggle("learned-word");
        this.settleEvent(target, messageElement, container, "easy", true);
      } else {
        target.innerHTML =
          target.innerHTML.trim() === "сложное" ? "простое" : "сложное";
        target.classList.toggle("difficult-word");
        container.classList.toggle("difficult");
        this.settleEvent(target, messageElement, container, "hard", false);
      }
    };
    addToDifficultBtns.forEach((btn) => {
      btn.addEventListener("click", btnOnclick);
    });
    addToLearnedBtns.forEach((btn) => {
      btn.addEventListener("click", btnOnclick);
    });
  }
  addButtons() {
    const buttonsContainers = document.querySelectorAll(".words-buttons");
    buttonsContainers.forEach((container) => {
      const newAddToDifficultButton = document.createElement("button");
      const newAddToLearnedButton = document.createElement("button");
      newAddToLearnedButton.className = "add-to-learned";
      newAddToDifficultButton.className = "add-to-difficult";
      newAddToDifficultButton.innerText = "сложное";
      newAddToLearnedButton.innerText = "изученное";
      container.append(newAddToDifficultButton, newAddToLearnedButton);
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
    const wrapper = document.querySelector(
      ".textbook__words-wrapper"
    ) as HTMLDivElement;
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
                    "userWord.difficulty": "hard || easy",
                  },
                ],
              }),
            },
          },
          JSON.parse(localStorage["user"]).token
        )
        .then((data) => {
          const wordInfo = data as Array<IWords>;
          const isDifficultWord = wordInfo[0]?.userWord?.difficulty === "hard";
          const isLearnedWord = wordInfo[0]?.userWord?.difficulty === "easy";

          const messageElement = document.querySelector(
            `[data-id="${wordInfo[0]?._id}"] .word-card__message`
          ) as HTMLDivElement;

          const currentPageBtn = document.querySelector(
            ".page-btn.active"
          ) as HTMLButtonElement;

          if (isDifficultWord) {
            this.learnedCount += 1;

            const difficultWordButton = document.querySelector(
              `[data-id="${id}"] .words-buttons .add-to-difficult`
            ) as HTMLButtonElement;
            const container = difficultWordButton.closest(
              ".word-card-main"
            ) as HTMLDivElement;
            container.classList.add("difficult");

            difficultWordButton.classList.add("difficult-word");
            difficultWordButton.innerText = "простое";

            messageElement.style.display = "block";
            messageElement.innerText = "сложное";
          } else if (isLearnedWord) {
            this.learnedCount += 1;

            const learnedWordButton = document.querySelector(
              `[data-id="${id}"] .words-buttons .add-to-learned`
            ) as HTMLButtonElement;
            const container = learnedWordButton.closest(
              ".word-card-main"
            ) as HTMLDivElement;
            container.classList.add("learned");

            learnedWordButton.classList.add("learned-word");
            learnedWordButton.innerText = "не изученное";

            messageElement.style.display = "block";
            messageElement.innerText = "изученное";
          }
          if (this.learnedCount === 20) {
            wrapper.style.boxShadow = "0px 0px 30px green ";
            currentPageBtn.style.background = "green";
          } else {
            wrapper.style.boxShadow = "none";
            currentPageBtn.style.background = "#ddd";
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
