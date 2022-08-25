import viewerTextbook from "./renderTextbook";
import { textbookPagination } from "./pagination";
export default class TextbookSections {
  totalWordsNumber: number;
  sectionNumber = 0;
  constructor(totalWordsNumber: number) {
    this.totalWordsNumber = totalWordsNumber;
    this.init();
  }
  init() {
    const sections = document.querySelectorAll(".textbook__section");
    const textbookWordsWrapper = document.querySelector(
      ".textbook__words-wrapper"
    ) as HTMLDivElement;
    sections.forEach((section) => {
      const sectionNumber = Number(section.id[section.id.length - 1]);
      section.addEventListener("click", () => {
        localStorage.setItem("sectionNumber", String(sectionNumber));
        localStorage.setItem("currentPage", "1");
        textbookPagination.update(1);
        viewerTextbook.renderCards(textbookWordsWrapper, 0, sectionNumber - 1);
        this.sectionNumber = sectionNumber - 1;
      });
    });
  }
}
