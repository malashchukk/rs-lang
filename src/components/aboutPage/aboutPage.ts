import "./about.scss"

export class About{
    static instance: About;
    btnAbout = document.querySelector('.nav_about') as HTMLElement;    

    constructor() {
        if (typeof About.instance === 'object') {
            return About.instance;
        }   
        About.instance = this;
        return About.instance;
    }

    ListenerBtnAbout(){
        this.btnAbout.addEventListener('click', this.showAbout)
        
    }

    showAbout(): void{
        const main = document.querySelector('.main') as HTMLElement;
        main.innerHTML = `
        <div class="about_team_wrapper">
        <section class="about_content">
          <div class="member">
            <div class="member_img">
              <img src="./assets/76225250.jfif" alt="avatar">
            </div>
            <div class="member_inform">
              <h2 class="member_inform_title">Malashchukk</h2>
              <p class="member_text">What did you do</p>
            </div>            
          </div>
          <div class="member">
            <div class="member_img">
              <img src="./assets/101009594.png" alt="avatar">
            </div>
            <div class="member_inform">
              <h2 class="member_inform_title">NikitosBarboc</h2>
              <p class="member_text">What did you do</p>
            </div>            
          </div>
          <div class="member">
            <div class="member_img">
              <img src="./assets/94239888.jfif" alt="avatar">
            </div>
            <div class="member_inform">
              <h2 class="member_inform_title">DelfiaHope</h2>
              <p class="member_text">What did you do</p>
            </div>            
          </div>
        </section>
      </div>
      `
    }

}