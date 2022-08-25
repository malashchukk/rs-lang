import router from "../controller/Router";
import WordRender from "./wordRender";
import { textbookPagination } from "./pagination";
import TextbookSections from "./SectionTextbook";
class ViewerTextbook extends WordRender {
  private mainContent = document.querySelector(".main") as HTMLDivElement;
  private removeMainContent() {
    this.mainContent.innerHTML = "";
  }

  async renderMain(wordsNumber: number, numberOfSections: number) {
    this.removeMainContent();
    this.mainContent.innerHTML = `<div class="textbook">${this.drawTextbookNavigation()} ${this.drawTextbookAside(
      numberOfSections
    )} <div class="textbook__words-wrapper"></div></div>`;
    await this.renderCards(
      document.querySelector(".textbook__words-wrapper") as HTMLDivElement,
      Number(localStorage.getItem("currentPage")) - 1,
      Number(localStorage.getItem("sectionNumber")) - 1
    );
    // вынести куда-то

    new TextbookSections(wordsNumber);
    textbookPagination.init(
      document.querySelector(".textbook") as HTMLDivElement
    );
    textbookPagination.onChange((e) => {
      const target = e?.target as HTMLDivElement;
      console.log(Number(parseInt(target.id)));
      localStorage.setItem("currentPage", String(Number(parseInt(target.id))));
      this.renderCards(
        document.querySelector(".textbook__words-wrapper") as HTMLDivElement,
        Number(localStorage.getItem("currentPage")) - 1,
        Number(localStorage.getItem("sectionNumber")) - 1
      );
    });
  }
  drawTextbookAside(numberOfSection: number): string {
    let html = `<aside class="main__textbookNav">`;
    for (let i = 1; i <= numberOfSection; i += 1) {
      html += `<div class="textbook__section" id="chapter${i}"><img class="textbook__section-img textbook-small-img" src="./assets/svg/Book.svg">Раздел ${i}</div>`;
    }
    const difficultSectionWords = `<div class="textbook__section" id="difficult-words-section"><img class="textbook__section-img textbook-small-img" src="./assets/svg/Book.svg">Сложные слова</div>`;
    html += difficultSectionWords;
    return html + `</aside>`;
  }
  drawTextbookNavigation(): string {
    return `<nav class="textbook__header">
      <h2 class="textbook__title">Онлайн Учебник</h2>
      <div class="textbook__settings">
      <span>НАСТРОЙКИ</span><img src="./assets/svg/applications-system.svg" class="textbook-small-img settings-img" alt="settings">
      </div>
    </nav>`;
  }
}

const viewerTextbook = new ViewerTextbook();
export default viewerTextbook;

router.add("textbook", () => {
  const wordsNumber = 3600;
  const numberOfSections = 6;
  if (!localStorage.getItem("sectionNumber")) {
    localStorage.setItem("sectionNumber", "1");
  }
  viewerTextbook.renderMain(wordsNumber, numberOfSections);
});
