import viewerTextbook from "./renderTextbook";
import { textbookPagination } from "./pagination";
import crudApi from "../controller/CRUD/CrudApi";
import IWords from "./IWords";
import preloader from "./preloader";
type aggregatedWordsResponse = {
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
    const difficultWordButton = document.querySelectorAll(".add-to-difficult");
    difficultWordButton.forEach((btn) => {
      btn.addEventListener("click", (event: Event) => {
        const target = event.target as HTMLButtonElement;
        const wordCard = target.closest(".word-card") as HTMLDivElement;
        wordCard.style.display = "none";
      });
    });
  }
  init() {
    const sections = document.querySelectorAll(".textbook__section");
    const textbookWordsWrapper = document.querySelector(
      ".textbook__words-wrapper"
    ) as HTMLDivElement;
    sections.forEach((section) => {
      const sectionNumber = Number(section.id[section.id.length - 1]);
      section.addEventListener("click", (event) => {
        localStorage.removeItem("isDifficultySection");
        const preloaderContainer = document.querySelector(
          ".pagination"
        ) as HTMLDivElement;
        const target = event.target as HTMLButtonElement;
        const isDifficultWordsSection = target.id === "difficult-words-section";
        if (!isDifficultWordsSection) {
          preloaderContainer.style.display = "flex";
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
    const preloaderContainer = document.querySelector(
      ".pagination"
    ) as HTMLDivElement;
    preloaderContainer.style.display = "none";
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
