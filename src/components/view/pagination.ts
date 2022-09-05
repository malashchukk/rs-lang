export default class PaginationButton {
  totalPages: number;
  maxVisiblePages: number;
  currentPage: number;
  pagesNumbers: Array<number> = [];
  currentPageBtn: HTMLButtonElement = document.createElement("button");
  paginationButtons = new Map();
  fragment: DocumentFragment = document.createDocumentFragment();
  disabled = {
    start: () => this.currentPage === 1,
    prev: () => this.currentPage === 1,
    end: () => this.currentPage >= this.totalPages,
    next: () => this.currentPage >= this.totalPages,
  };
  paginationContainer = document.createElement("div");
  constructor(totalPages: number, maxVisiblePages = 10, currentPage = 1) {
    this.currentPage = currentPage;
    this.maxVisiblePages = maxVisiblePages;
    this.totalPages = totalPages;
  }
  createButtons() {
    const onPageButtonClick = (e?: Event) => {
      const currentTarget = e?.currentTarget as HTMLButtonElement;
      this.currentPage = Number(currentTarget.textContent);
    };
    this.paginationButtons.set(
      this.createAndSetupButton(
        "start",
        "start-page",
        this.disabled.start(),
        () => (this.currentPage = 1)
      ),
      (btn: HTMLButtonElement) => (btn.disabled = this.disabled.start())
    );

    this.paginationButtons.set(
      this.createAndSetupButton(
        "prev",
        "prev-page",
        this.disabled.prev(),
        () => (this.currentPage -= 1)
      ),
      (btn: HTMLButtonElement) => (btn.disabled = this.disabled.prev())
    );

    this.pagesNumbers.map((pageNumber, index) => {
      const isCurrentPage = this.currentPage === pageNumber;
      const button = this.createAndSetupButton(
        String(pageNumber),
        isCurrentPage ? "active" : "",
        false,
        onPageButtonClick
      );

      if (isCurrentPage) {
        this.currentPageBtn = button;
      }

      this.paginationButtons.set(button, this.onPageButtonUpdate(index));
    });

    this.paginationButtons.set(
      this.createAndSetupButton(
        "next",
        "next-page",
        this.disabled.next(),
        () => (this.currentPage += 1)
      ),
      (btn: HTMLButtonElement) => (btn.disabled = this.disabled.next())
    );

    this.paginationButtons.set(
      this.createAndSetupButton(
        "end",
        "end-page",
        this.disabled.end(),
        () => (this.currentPage = this.totalPages)
      ),
      (btn: HTMLButtonElement) => (btn.disabled = this.disabled.end())
    );
  }
  init(container: HTMLDivElement) {
    this.pagesNumbers = this.pageNumbers(
      this.totalPages,
      this.maxVisiblePages,
      this.currentPage
    );
    if (document.querySelector(".pagination")) {
      document.querySelector(".pagination")?.remove();
    }
    this.paginationContainer.className = "pagination";
    if (this.paginationButtons.size <= 1) {
      this.createButtons();
    }

    this.paginationButtons.forEach((_, btn) => this.fragment.appendChild(btn));
    this.paginationContainer.appendChild(this.fragment);
    this.render(container);
  }
  pageNumbers = (total: number, max: number, current: number) => {
    const half = Math.floor(max / 2);
    let to = max;

    if (current + half >= total) {
      to = total;
    } else if (current > half) {
      to = current + half;
    }

    const from = Math.max(to - max, 0);
    return Array.from({ length: Math.min(total, max) }, (_, i) => i + 1 + from);
  };

  createAndSetupButton(
    label = "",
    cls = "",
    disabled = false,
    handleClick = (event?: Event) => {
      event;
    }
  ) {
    const newButton = document.createElement("button");
    newButton.textContent = label;
    newButton.className = `page-btn ${cls}`;
    newButton.disabled = disabled;
    newButton.addEventListener("click", (e) => {
      handleClick(e);
      this.update();
      this.paginationContainer.id = String(this.currentPage);
      const currentPageBtn = this.currentPageBtn;
      this.paginationContainer.dispatchEvent(
        new CustomEvent("change", { detail: { currentPageBtn } })
      );
    });

    return newButton;
  }

  onPageButtonUpdate(index: number) {
    return (btn: HTMLButtonElement) => {
      btn.textContent = String(this.pagesNumbers[index]);

      if (this.pagesNumbers[index] === this.currentPage) {
        this.currentPageBtn.classList.remove("active");
        btn.classList.add("active");
        this.currentPageBtn = btn;
        this.currentPageBtn.focus();
      }
    };
  }
  render(container: HTMLDivElement) {
    // console.log(container);
    // console.log(this.paginationContainer);
    container.appendChild(this.paginationContainer);
  }

  update(newPageNumber = this.currentPage) {
    this.currentPage = newPageNumber;
    this.pagesNumbers = this.pageNumbers(
      this.totalPages,
      this.maxVisiblePages,
      this.currentPage
    );
    this.paginationButtons.forEach((updateButton, btn) => updateButton(btn));
  }

  onChange = (
    handler = (e?: Event) => {
      e;
    }
  ) => {
    this.paginationContainer.addEventListener("change", handler);
  };
}
const currentPage = localStorage.getItem("currentPage") || 1;
export const textbookPagination = new PaginationButton(30, 10, +currentPage);
