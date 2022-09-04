class Preloader {
  private timer!: NodeJS.Timer;
  private container!: HTMLDivElement;
  init(container: HTMLDivElement) {
    this.container = container;
    const preloader = document.createElement("div");
    container.append(preloader);
    const preloaderHTML = `<div class="preloader">
        <div class="preloader__loader">
        <div class="loadingio-spinner-spinner-ovqvmy17tv"><div class="loader-part"> <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
        </div>
      </div>
    `;
    preloader.outerHTML = preloaderHTML;
    this.hide();
  }
  async hideInHtml() {
    const preloader = document.querySelector(".preloader") as HTMLDivElement;
    if (preloader) {
      preloader.style.opacity = "0";
      preloader.style.zIndex = "-1";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 400);
    }
  }
  private async hide() {
    clearInterval(this.timer);
    const className = this.container.className;
    const images = document.querySelectorAll(`.${className} img`);
    let loaded = 0;
    for (let i = 0; i < images.length; i += 1) {
      images[i]?.addEventListener("load", () => (loaded += 1));
    }
    this.timer = setInterval(() => {
      if (loaded === images.length) {
        this.hideInHtml();
        clearInterval(this.timer);
      }
    }, 100);
  }
}
const preloader = new Preloader();
export default preloader;
