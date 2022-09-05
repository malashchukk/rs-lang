import "./about.scss";
import router from "../../controller/Router";

export class About {
    
  btnAbout = document.querySelector(".nav_about") as HTMLElement;

  ListenerBtnAbout() {
    this.btnAbout.addEventListener("click", this.showAbout);
  }

  showAbout(): void {
    const main = document.querySelector(".main") as HTMLElement;
    main.innerHTML = `
    <div class="about_team_wrapper">
    <section class="about_content">
      <div class="member">
        <div class="member_img">
          <img src="./assets/76225250.jfif" alt="avatar">
        </div>
        <div class="member_inform">
          <h2 class="member_inform_title">Malashchukk</h2>
          <h3 class="who"><span>Team lead</span></h3>
          <p class="member_text">Координировал команду. Создал и настроил роутинг, реализовал авторизацию и разавторизацию. Создал игру Спринт. </p>
        </div>            
      </div>
      <div class="member">
        <div class="member_img">
          <img src="./assets/101009594.png" alt="avatar">
        </div>
        <div class="member_inform">
          <h2 class="member_inform_title">NikitosBarboc</h2>
          <h3 class="who"><span>Developer</span></h3>
          <p class="member_text">Создал страницы словаря и электронный учебника, списока слов, настроил запросы на сервер, логику изученных слов в учебнике.</p>
        </div>            
      </div>
      <div class="member">
        <div class="member_img">
          <img src="./assets/94239888.jfif" alt="avatar">
        </div>
        <div class="member_inform">
          <h2 class="member_inform_title">DelfiaHope</h2>
          <h3 class="who"><span>Developer</span></h3>
          <p class="member_text">Создала главную страницу, игру Аудиовызов, краткосрочная статистика, алгоритм добавления слов, использованных в играх.</p>
        </div>            
      </div>
    </section>
  </div>
      `;
  }
} 
export const pageAbout = new About();

router.add("about", () => {
 pageAbout.showAbout()
});
