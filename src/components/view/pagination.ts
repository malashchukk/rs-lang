export default class PaginationButton {
  totalPages: number;
  maxPagesVisible: number;
  currentPage: number;
  pages: Array<number> = [];
  currentPageBtn: HTMLButtonElement = document.createElement("button");
  buttons = new Map();
  frag: DocumentFragment = document.createDocumentFragment();
  disabled = {
    start: () => this.currentPage === 1,
    prev: () => this.currentPage === 1,
    end: () => this.currentPage >= this.totalPages,
    next: () => this.currentPage >= this.totalPages,
  };
  paginationButtonContainer = document.createElement("div");
  constructor(totalPages: number, maxPagesVisible = 10, currentPage = 1) {
    this.currentPage = currentPage;
    this.maxPagesVisible = maxPagesVisible;
    this.totalPages = totalPages;
  }
  createButtons() {
    const onPageButtonClick = (e?: Event) => {
      const currentTarget = e?.currentTarget as HTMLButtonElement;
      this.currentPage = Number(currentTarget.textContent);
    };
    this.buttons.set(
      this.createAndSetupButton(
        "start",
        "start-page",
        this.disabled.start(),
        () => (this.currentPage = 1)
      ),
      (btn: HTMLButtonElement) => (btn.disabled = this.disabled.start())
    );

    this.buttons.set(
      this.createAndSetupButton(
        "prev",
        "prev-page",
        this.disabled.prev(),
        () => (this.currentPage -= 1)
      ),
      (btn: HTMLButtonElement) => (btn.disabled = this.disabled.prev())
    );

    this.pages.map((pageNumber, index) => {
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

      this.buttons.set(button, this.onPageButtonUpdate(index));
    });

    this.buttons.set(
      this.createAndSetupButton(
        "next",
        "next-page",
        this.disabled.next(),
        () => (this.currentPage += 1)
      ),
      (btn: HTMLButtonElement) => (btn.disabled = this.disabled.next())
    );

    this.buttons.set(
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
    this.pages = this.pageNumbers(
      this.totalPages,
      this.maxPagesVisible,
      this.currentPage
    );
    if (document.querySelector(".pagination-buttons")) {
      document.querySelector(".pagination-buttons")?.remove();
    }
    this.paginationButtonContainer.className = "pagination-buttons";
    this.createButtons();
    this.buttons.forEach((_, btn) => this.frag.appendChild(btn));
    this.paginationButtonContainer.appendChild(this.frag);
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
    const buttonElement = document.createElement("button");
    buttonElement.textContent = label;
    buttonElement.className = `page-btn ${cls}`;
    buttonElement.disabled = disabled;
    buttonElement.addEventListener("click", (e) => {
      handleClick(e);
      this.update();
      this.paginationButtonContainer.id = String(this.currentPage);
      const currentPageBtn = this.currentPageBtn;
      this.paginationButtonContainer.dispatchEvent(
        new CustomEvent("change", { detail: { currentPageBtn } })
      );
    });

    return buttonElement;
  }

  onPageButtonUpdate(index: number) {
    return (btn: HTMLButtonElement) => {
      btn.textContent = String(this.pages[index]);

      if (this.pages[index] === this.currentPage) {
        this.currentPageBtn.classList.remove("active");
        btn.classList.add("active");
        this.currentPageBtn = btn;
        this.currentPageBtn.focus();
      }
    };
  }
  render(container: HTMLDivElement) {
    container.appendChild(this.paginationButtonContainer);
  }

  update(newPageNumber = this.currentPage) {
    this.currentPage = newPageNumber;
    this.pages = this.pageNumbers(
      this.totalPages,
      this.maxPagesVisible,
      this.currentPage
    );
    this.buttons.forEach((updateButton, btn) => updateButton(btn));
  }

  onChange = (
    handler = (e?: Event) => {
      e;
    }
  ) => {
    this.paginationButtonContainer.addEventListener("change", handler);
  };
}
const currentPage = localStorage.getItem("currentPage") || 1;
export const textbookPagination = new PaginationButton(30, 10, +currentPage);
