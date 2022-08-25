import "./main.scss";

export class Main {
  static instance: Main;
  logo = document.querySelector(".logo") as HTMLElement;

  constructor() {
    if (typeof Main.instance === "object") {
      return Main.instance;
    }
    Main.instance = this;
    return Main.instance;
  }

  ListenerLogo() {
    this.logo.addEventListener("click", this.showMain);
  }

  showMain(): void {
    const main = document.querySelector(".main") as HTMLElement;
    main.innerHTML = `
        <section class="section_presentation_rslang">
        <div class="main_content">
          <div class="section_presentation_content">
            <div class="section_presentation_text"> 
              <h1 class="rsleng_text">RS Lang</h1> 
              <p>изучай английский язык с удовольствием</p>
            </div>
            <div class="section_presentation_img">
              <img src="./assets/jpg/doyoy speakjpg.jpg" alt="speakEnglish">
            </div>
          </div>
       </div>
    </section>
    <section class="section_benefits">
      <div class="main_content">
        <div class="section_benefits_content">
            <h2 class="section_benefits_title">Почему с нами изучать английский просто?</h2>
            <div class="box_benefit">                
            <div class="box_benefit_item">
              <img src="./assets/svg/easy.svg">
              <h3>Простой и понятный</h3>
              <p>Простой и интуитивно понятный дизайн и структура приложения. Яркие, красочные элементы, которые позволят быстрее запоминать и вспоминать изученные слова. </p>
            </div>
            <div class="box_benefit_item">
              <img src="./assets/svg/gemes.svg">
              <h3>Игры</h3>
              <p>Для изучения слов и закрепления запоминания в приложении есть 2 игры: Аудиовызов, спринт, которые помогут вам в игровой форме «прокачать» словарный запас.</p>
            </div>
            <div class="box_benefit_item">
              <img src="./assets/svg/textbook.svg">
              <h3>Учебник</h3>
              <p>Содержит 4000 часто встречающихся слов. Представлены перевод слова, тематическое изображение, а также произношение слов.</p>
            </div>
            <div class="box_benefit_item">
              <img src="./assets/svg/statistic.svg">
              <h3>Статистика</h3>
              <p>Следи за своим прогрессом каждый день. Подробная статистика твоих достижений, изученных слов и ошибок.</p>
            </div>
            </div>
        </div>
      </div>          
    </section>
    <section class="section_join">
      <div class="main_content">
        <div class="section_join_content">
          <div class="section_join_img">                
            <img src="./assets/jpg/people.jpg">
          </div>
          <div class="section_join_text">
          <h2 class="section_join_title">Присоединяйся к нам уже сегодня!</h2>
          <button class="authorization-buttons" href="account"></
          </div>           
      </div>          
    </section>
        `;
  }
}
