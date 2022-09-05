import crudApi from "../controller/CRUD/CrudApi";
import router from "../controller/Router";
import IWords from "./IWords";
import WordRender from "./wordRender";
import { aggregatedWordsResponse } from "./SectionTextbook";
import preloader from "./preloader";
import user from "../controller/authorization/authorization";
import authorizedUser from "../controller/authorization/autorizatedUser";
import { updateStat } from "../controller/statistic/updateStatistic";

class ViewerDictionary {
  private mainContent = document.querySelector(".main") as HTMLDivElement;
  private removeMainContent() {
    this.mainContent.innerHTML = "";
  }
  wordRender!: WordRender;

  async renderMain(numberOfSections: number) {
    this.removeMainContent();
    this.mainContent.innerHTML = `<div class="dictionary">${this.drawTextbookNavigation()} ${this.drawTextbookAside(
      numberOfSections
    )} <div class="dictionary__main">
    <div class="dictionary__words-wrapper-header">
      <button class="easy words-type" data-difficulty="easy">Изученные слова</button>
      <button class="hard words-type" data-difficulty="hard">Сложные слова </button> 
    </div>
    <div class="dictionary__words-wrapper">
      
    </div>
    </div></div>`;
    this.setWordsWrapperStyle();
    this.setSectionsButtonsEvents();
    this.setTypeButtonsEvents();
    if (localStorage["user"]) {
      await this.renderWords();
    }
  }
  private setWordsWrapperStyle() {
    const wordsWrapper = document.querySelector(
      ".dictionary__words-wrapper"
    ) as HTMLDivElement;
    if (!localStorage["dictionaryStyle"]) {
      localStorage.setItem("dictionaryStyle", "chapter1");
    }
    wordsWrapper.id = localStorage["dictionaryStyle"];
  }
  setSectionsButtonsEvents() {
    if (!localStorage["dictionarySectionNumber"]) {
      localStorage.setItem("dictionarySectionNumber", "1");
    }
    const dictionaryNav = document.querySelector(
      ".main__textbookNav"
    ) as HTMLDivElement;
    dictionaryNav.addEventListener("click", (event) => {
      const target = event.target as HTMLButtonElement;
      if (target.classList.contains("dictionary__section")) {
        const wordWrapper = document.querySelector(
          ".dictionary__words-wrapper"
        ) as HTMLDivElement;
        wordWrapper.id = target.id;
        localStorage.setItem(
          "dictionarySectionNumber",
          target.id[target.id.length - 1] as string
        );
        localStorage.setItem("words-type", `easy`);
        localStorage.setItem("dictionaryStyle", target.id);
        this.renderWords();
      }
    });
  }
  setTypeButtonsEvents() {
    if (!localStorage["words-type"]) {
      localStorage.setItem("words-type", "learnedWords");
    }

    const wrapperHeader = document.querySelector(
      ".dictionary__words-wrapper-header"
    ) as HTMLDivElement;
    wrapperHeader.addEventListener("click", (event) => {
      const target = event.target as HTMLDivElement;
      if (target.classList.contains("words-type")) {
        localStorage.setItem("words-type", `${target.classList[0]}`);
      }
      this.renderWords();
    });
  }
  private async renderWords() {
    const group = Number(localStorage["dictionarySectionNumber"]) - 1;
    const maxWordsPerGroup = 600;
    crudApi
      .getItem(
        {
          endpoint: `/users/${
            JSON.parse(localStorage["user"]).userId
          }/aggregatedWords/`,
          options: {
            wordsPerPage: maxWordsPerGroup,
            group: group,
            filter: JSON.stringify({
              $and: [
                {
                  "userWord.difficulty": `${
                    localStorage["words-type"] as string
                  }`,
                },
              ],
            }),
          },
        },
        JSON.parse(localStorage["user"]).token
      )
      .then((data) => {
        const wordsWrapper = document.querySelector(
          ".dictionary__words-wrapper"
        ) as HTMLDivElement;
        const response = data as aggregatedWordsResponse[];
        const wordsInfo = response[0]?.paginatedResults as IWords[];
        const wordRender = new WordRender();
        this.wordRender = wordRender;
        const html = wordsInfo.reduce((acc, curr) => {
          return (acc += wordRender.createCard(curr));
        }, ``);
        wordsWrapper.innerHTML = html;
        preloader.init(wordsWrapper);
        wordRender.addAudioEvent();
        this.addButtons();
        this.addReestablishBtnEvents();
      });
  }
  drawTextbookAside(numberOfSection: number): string {
    let html = `<aside class="main__textbookNav">`;
    for (let i = 1; i <= numberOfSection; i += 1) {
      html += `<button class="dictionary__section" id="chapter${i}"><img class="dictionary__section-img dictionary-small-img" src="./assets/svg/Book.svg">Раздел ${i}</button>`;
    }
    return html + `</aside>`;
  }
  drawTextbookNavigation(): string {
    return `<nav class="dictionary__header">
      <h2 class="dictionary__title">Словарь</h2>
    </nav>`;
  }
  addButtons() {
    const wordsButtonsWrapper = document.querySelectorAll(
      ".words-buttons"
    ) as NodeListOf<HTMLDivElement>;
    wordsButtonsWrapper.forEach((wrapper) => {
      const newButton = document.createElement("button");
      newButton.id = "reestablish-btn";
      if (localStorage["words-type"] === "easy") {
        newButton.className = "easy";
        newButton.innerText = "Убрать из изученных";
      } else {
        newButton.className = "hard";
        newButton.innerText = "востановить";
      }
      wrapper.append(newButton);
    });
  }
  addReestablishBtnEvents() {
    const wordCards = document.querySelectorAll(
      ".word-card"
    ) as NodeListOf<HTMLDivElement>;
    wordCards.forEach((card) => {
      card.addEventListener("click", (event) => {
        const currentTarget = event.currentTarget as HTMLDivElement;
        const target = event.target as HTMLButtonElement;
        if (target.id === "reestablish-btn") {
          const user = JSON.parse(localStorage["user"]) as authorizedUser;
          const wordId = currentTarget.getAttribute("data-id");
          crudApi
            .deleteItem(
              {
                endpoint: `/users/${user.userId}/words/${wordId}`,
              },
              user.token
            )
            .then(() => {
              currentTarget.remove();
            });
        }
        updateStat.collectStatistic();
      });
    });
  }
  async update(isAuthorized: boolean) {
    const wordsWrapper = document.querySelector(
      ".dictionary__words-wrapper"
    ) as HTMLDivElement;
    if (isAuthorized) {
      await this.renderWords();
    } else {
      wordsWrapper.innerHTML = "";
    }
  }
}

router.add("dictionary", () => {
  const dictionary = new ViewerDictionary();
  user.subscribe(dictionary);
  dictionary.renderMain(6);
});
