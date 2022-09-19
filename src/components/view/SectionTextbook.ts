import viewerTextbook from "./renderTextbook";
import { textbookPagination } from "./pagination";
import crudApi from "../controller/CRUD/CrudApi";
import IWords from "./IWords";
import preloader from "./preloader";
export type aggregatedWordsResponse = {
  paginatedResults: Array<IWords>;
  totalCount: Array<{ count: number }>;
};
export default class TextbookSections {
  totalWordsNumber: number;
  sectionNumber = 0;
  constructor(totalWordsNumber: number) {
    this.totalWordsNumber = totalWordsNumber;
    this.init();
  }
  setButtonsEvent() {
    viewerTextbook.addButtonsEvents();
    const difficultWordButtons = document.querySelectorAll(".add-to-difficult");
    const learnedWordButtons = document.querySelectorAll(".add-to-learned");
    difficultWordButtons.forEach((btn) => {
      btn.addEventListener("click", (event: Event) => {
        const target = event.target as HTMLButtonElement;
        const wordCard = target.closest(".word-card") as HTMLDivElement;
        wordCard.remove();
      });
    });
    learnedWordButtons.forEach((btn) => {
      btn.addEventListener("click", (event: Event) => {
        const target = event.target as HTMLButtonElement;
        const wordCard = target.closest(".word-card") as HTMLDivElement;
        wordCard.remove();
      });
    });
  }
  hideLearnedButtons() {
    const currentPageBtn = document.querySelectorAll(
      ".page-btn"
    ) as NodeListOf<HTMLButtonElement>;
    currentPageBtn.forEach((btn) => {
      btn.style.background = "#ddd";
    });
  }
  init() {
    const sections = document.querySelectorAll(".textbook__section");
    const textbookWordsWrapper = document.querySelector(
      ".textbook__words-wrapper"
    ) as HTMLDivElement;

    if (!localStorage["textbookStyle"]) {
      localStorage.setItem("textbookStyle", "chapter1");
    }
    if (!localStorage["isDifficultySection"]) {
      textbookWordsWrapper.id = localStorage["textbookStyle"];
    } else {
      textbookWordsWrapper.id = "difficult-words-section";
    }

    sections.forEach((section) => {
      const sectionNumber = Number(section.id[section.id.length - 1]);
      section.addEventListener("click", (event) => {
        this.hideLearnedButtons();
        localStorage.removeItem("isDifficultySection");
        const paginationContainer = document.querySelector(
          ".pagination"
        ) as HTMLDivElement;
        const wordWrapper = document.querySelector(
          ".textbook__words-wrapper"
        ) as HTMLDivElement;
        const target = event.target as HTMLButtonElement;
        wordWrapper.id = target.id;
        const isDifficultWordsSection = target.id === "difficult-words-section";
        if (!isDifficultWordsSection) {
          localStorage.setItem("textbookStyle", target.id);

          paginationContainer.style.display = "flex";
          localStorage.setItem("sectionNumber", String(sectionNumber));
          localStorage.setItem("currentPage", "1");
          textbookPagination.update(1);
          viewerTextbook.renderCards(
            textbookWordsWrapper,
            0,
            sectionNumber - 1
          );
          this.sectionNumber = sectionNumber - 1;
        } else if (localStorage["user"]) {
          localStorage.setItem("isDifficultySection", "true");
          this.showDifficultWords();
        }
      });
    });
  }
  showDifficultWords() {
    const paginationContainer = document.querySelector(
      ".pagination"
    ) as HTMLDivElement;
    paginationContainer.style.display = "none";
    crudApi
      .getItem(
        {
          endpoint: `/users/${
            JSON.parse(localStorage["user"]).userId
          }/aggregatedWords`,
          options: {
            wordsPerPage: 3600,
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
        const response = data as aggregatedWordsResponse[];
        const wordsInfo = response[0]?.paginatedResults as IWords[];
        this.renderDifficultWords(response);
        viewerTextbook.addButtons();
        this.setButtonsEvent();

        wordsInfo.forEach((info) => {
          viewerTextbook.checkWord(info._id as string);
        });
        preloader.init(
          document.querySelector(".textbook__words-wrapper") as HTMLDivElement
        );
      });
  }
  private renderDifficultWords(wordsInfo: aggregatedWordsResponse[]) {
    const wordsWrapper = document.querySelector(
      ".textbook__words-wrapper"
    ) as HTMLDivElement;
    const html = wordsInfo[0]?.paginatedResults.reduce((acc, curr) => {
      return (acc += viewerTextbook.createCard(curr));
    }, "") as string;

    wordsWrapper.innerHTML = html;
  }
}
