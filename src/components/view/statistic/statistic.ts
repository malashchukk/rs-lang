import crudApi from "../../controller/CRUD/CrudApi";
import "./statistic.scss";
import {
  IStatisticsStore,
  statisticDefault,
} from "../../controller/statistic/IStatisticStore";
import { updateStat } from "../../controller/statistic/updateStatistic";

async function getStatistic(): Promise<void> {
  const statistic: IStatisticsStore = await crudApi.getItem(
    {
      endpoint: `/users/${JSON.parse(localStorage["user"]).userId}/statistics`,
    },
    JSON.parse(localStorage["user"]).token
  );
  if (
    statistic &&
    statistic.optional.currentDate === new Date().toISOString().slice(0, 10)
  ) {
    showStatistic.showPageStatistic(statistic);
  } else {
    showStatistic.showPageStatistic();
    updateStat.clearStatistics();
  }
}

class Statistic {
  getAccount() {
    if (localStorage["user"]) {
      getStatistic();
    } else {
      alert("Вы не авторизованы");
    }
  }

  showPageStatistic(statistic: IStatisticsStore = statisticDefault) {
    const main = document.querySelector(".main") as HTMLElement;
    main.innerHTML = `
    <section class="statistic_wrapper">
    <h1>Статистика за сегодня</h1>
    <div class="statistic_inform">
      <div class="statistic_today">
        <h3> <span> ${statistic.optional.newWord} </span> новых слов</h3>
        <h3> <span> ${statistic.learnedWords} </span> слов изучено</h3>
        <h3> <span> ${statistic.optional.trueAnswer}% </span> правильных ответов</h3>
      </div>
      <div class="games_statistic_wrapper">
        <div class="game_statistic_card">
          <h2>Спринт</h2>
          <h3><img src="assets/svg/checkMark.svg">Новых слов: ${statistic.optional.sprint.wordsInGame} </h3>
          <h3><img src="assets/svg/checkMark.svg">Правильных ответов: ${statistic.optional.sprint.trueAnswers}%.</h3>
          <h3><img src="assets/svg/checkMark.svg">Самая длинная серия правильных ответов: ${statistic.optional.sprint.maxInRow}.</h3>
          <h3><img src="assets/svg/checkMark.svg">Баллы за последнюю игру: ${statistic.optional.sprint.points} </h3>
          <div class="circle"></div>
        </div>
        <div class="game_statistic_card">
          <h2>Аудиовызов</h2>
          <h3><img src="assets/svg/checkMark.svg">Новых слов: ${statistic.optional.audioCall.wordsInGame} слов.</h3>
          <h3><img src="assets/svg/checkMark.svg">Правильных ответов: ${statistic.optional.audioCall.trueAnswers}%.</h3>
          <h3><img src="assets/svg/checkMark.svg">Самая длинная серия правильных ответов: ${statistic.optional.audioCall.maxInRow}.</h3>
          <h3><img src="assets/svg/checkMark.svg">Баллы за последнюю игру: ${statistic.optional.audioCall.points} </h3>
          <div class="circle"></div>
        </div>
      </div>
    </div>
  </section>      
  `;
  }
}
export const showStatistic = new Statistic();
