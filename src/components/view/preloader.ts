class Preloader {
  private timer = setInterval(() => {});
  show(container: HTMLDivElement) {
    let preloader = document.querySelector(".preloader") as HTMLDivElement;
    if (preloader) {
      preloader.style.opacity = "1";
      preloader.style.zIndex = "1000";
    } else {
      preloader = document.createElement("div");
      container.append(preloader);
      const preloaderHTML = `<div class="preloader">
        <div class="preloader__loader">
        <div class="loadingio-spinner-spinner-ovqvmy17tv"><div class="loader-part"> <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
        </div>
      </div>
    `;
      preloader.outerHTML = preloaderHTML;
    }
  }
  async hideInHtml() {
    const preloader = document.querySelector(".preloader") as HTMLDivElement;
    preloader.style.opacity = "0";
    preloader.style.zIndex = "-1";
  }
  async hide(where: HTMLDivElement) {
    clearInterval(this.timer);
    console.log(where, this.timer);
    const className = where.className;
    const images = document.querySelectorAll(`.${className} img`);
    let loaded = 0;
    for (let i = 0; i < images.length; i += 1) {
      images[i]?.addEventListener("load", () => (loaded += 1));
    }
    this.timer = setInterval(() => {
      console.log(loaded, images.length);
      if (loaded === images.length) {
        this.hideInHtml();
        clearInterval(this.timer);
      }
    }, 100);
  }
}
const preloader = new Preloader();
export default preloader;
