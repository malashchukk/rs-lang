import router from "../controller/Router";
import RenderTextbookWords from "./renderWordsTextbook";
import { textbookPagination } from "./pagination";
import TextbookSections from "./SectionTextbook";
import user from "../controller/authorization/authorization";
class ViewerTextbook extends RenderTextbookWords {
  private mainContent = document.querySelector(".main") as HTMLDivElement;
  private removeMainContent() {
    this.mainContent.innerHTML = "";
  }

  async renderMain(wordsNumber: number, numberOfSections: number) {
    const defaultNumber = 1;
    this.removeMainContent();
    this.mainContent.innerHTML = `<div class="textbook">${this.drawTextbookNavigation()} ${this.drawTextbookAside(
      numberOfSections
    )} <div class="textbook__words-wrapper"></div></div>`;
    if (!localStorage["isDifficultySection"]) {
      await this.renderCards(
        document.querySelector(".textbook__words-wrapper") as HTMLDivElement,
        Number(localStorage["currentPage"] || defaultNumber) - defaultNumber,
        Number(localStorage["sectionNumber"] || defaultNumber) - defaultNumber
      );
    }

    const sections = new TextbookSections(wordsNumber);
    textbookPagination.init(
      document.querySelector(".textbook") as HTMLDivElement
    );
    textbookPagination.onChange((e) => {
      const target = e?.target as HTMLDivElement;
      localStorage.setItem("currentPage", String(Number(parseInt(target.id))));
      this.renderCards(
        document.querySelector(".textbook__words-wrapper") as HTMLDivElement,
        Number(localStorage["currentPage"] || defaultNumber) - defaultNumber,
        Number(localStorage["sectionNumber"] || defaultNumber) - defaultNumber
      );
    });
    if (localStorage["isDifficultySection"] && localStorage["user"]) {
      await sections.showDifficultWords();
    }
  }
  drawTextbookAside(numberOfSection: number): string {
    let html = `<aside class="main__textbookNav">`;
    for (let i = 1; i <= numberOfSection; i += 1) {
      html += `<button class="textbook__section" id="chapter${i}"><img class="textbook__section-img textbook-small-img" src="./assets/svg/Book.svg">Раздел ${i}</button>`;
    }
    const difficultSectionWords = `<button class="textbook__section" id="difficult-words-section"><img class="textbook__section-img textbook-small-img" src="./assets/svg/Book.svg">Сложные слова</button>`;
    html += difficultSectionWords;
    return html + `</aside>`;
  }
  drawTextbookNavigation(): string {
    return `<nav class="textbook__header">
      <h2 class="textbook__title">Онлайн Учебник</h2>
    </nav>`;
  }
}

const viewerTextbook = new ViewerTextbook();
export default viewerTextbook;

router.add("textbook", () => {
  const wordsNumber = 3600;
  const numberOfSections = 6;
  if (!localStorage["sectionNumber"]) {
    localStorage.setItem("sectionNumber", "1");
  }
  viewerTextbook.renderMain(wordsNumber, numberOfSections);
  user.subscribe(viewerTextbook);
});
