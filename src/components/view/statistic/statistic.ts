import "./statistic.scss";

export function showPageStatistic(){
    const main = document.querySelector(".main") as HTMLElement;
    main.innerHTML = `
    <section class="statistic_wrapper">
    <h1>Статистика за сегодня</h1>
    <div class="statistic_inform">
      <div class="statistic_today">
        <h3> <span> 12 </span> новых слов</h3>
        <h3> <span> 39 </span> слов изучено</h3>
        <h3> <span> 69% </span> правильных ответов</h3>
      </div>
      <div class="games_statistic_wrapper">
        <div class="game_statistic_card">
          <h2>Спринт</h2>
          <h3><img src="assets/svg/checkMark.svg">Изучено 19 слов.</h3>
          <h3><img src="assets/svg/checkMark.svg">Правильных ответов: 89%.</h3>
          <h3><img src="assets/svg/checkMark.svg">Самая длинная серия правильных ответов: 6.</h3>
          <div class="circle"></div>
        </div>
        <div class="game_statistic_card">
          <h2>Аудиовызов</h2>
          <h3><img src="assets/svg/checkMark.svg">Изучено 20 слов.</h3>
          <h3><img src="assets/svg/checkMark.svg">Правильных ответов: 50%.</h3>
          <h3><img src="assets/svg/checkMark.svg">Самая длинная серия правильных ответов: 6.</h3>
          <div class="circle"></div>
        </div>
      </div>
    </div>
  </section>      
  `
}