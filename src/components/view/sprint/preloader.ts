class Preloader {
  init(container: HTMLDivElement) {
    const preloader = document.createElement("div");
    container.append(preloader);
    const preloaderHTML = `<div class="preloader">
        <div class="preloader__loader">
        <div class="loadingio-spinner-spinner-ovqvmy17tv"><div class="loader-part"> <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div>
        </div>
      </div>
    `;
    // overflow-y: hidden;

    document.body.style.overflow = "hidden";
    preloader.outerHTML = preloaderHTML;
    // this.hide();
  }
  async hideInHtml() {
    document.body.style.overflow = "";
    const preloader = document.querySelector(".preloader") as HTMLDivElement;
    if (preloader) {
      preloader.style.opacity = "0";
      preloader.style.zIndex = "-1";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 400);
    }
  }
}
const preloader = new Preloader();
export default preloader;
