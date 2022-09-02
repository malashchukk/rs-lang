import crudApi from "../../controller/CRUD/CrudApi";
import "./statistic.scss";
import {
  IStatisticsStore,
  statisticDefault,
} from "../../controller/statistic/IStatisticStore";

class Statistic {

  userId: string  = ''
  userToken: string  = ''

  async getStatistic(): Promise<void> {    
    const statistic: IStatisticsStore = await crudApi.getItem(
      {
        endpoint: `/users/${
          this.userId
        }/statistics`,
      },
      this.userToken
    );

    statistic ? this.showPageStatistic(statistic) : this.showPageStatistic();
  }

  getAccount() {
    let user = JSON.parse(localStorage["user"])   
    
    if (user) {
      this.userId = user.userId;
      this.userToken = user.token;
      this.getStatistic(); /*********************************asked***************************** */
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
        <h3> <span> ${statistic.optional.correctAnswer}% </span> правильных ответов</h3>
      </div>
      <div class="games_statistic_wrapper">
        <div class="game_statistic_card">
          <h2>Спринт</h2>
          <h3><img src="assets/svg/checkMark.svg">Изучено ${statistic.optional.sprint.wordsInGame} слов.</h3>
          <h3><img src="assets/svg/checkMark.svg">Правильных ответов: ${statistic.optional.sprint.correctAnswers}%.</h3>
          <h3><img src="assets/svg/checkMark.svg">Самая длинная серия правильных ответов: ${statistic.optional.sprint.maxInRow}.</h3>
          <div class="circle"></div>
        </div>
        <div class="game_statistic_card">
          <h2>Аудиовызов</h2>
          <h3><img src="assets/svg/checkMark.svg">Изучено ${statistic.optional.audioCall.wordInGame} слов.</h3>
          <h3><img src="assets/svg/checkMark.svg">Правильных ответов: ${statistic.optional.audioCall.rightAnswers}%.</h3>
          <h3><img src="assets/svg/checkMark.svg">Самая длинная серия правильных ответов: ${statistic.optional.audioCall.InRow}.</h3>
          <div class="circle"></div>
        </div>
      </div>
    </div>
  </section>      
  `;
  }
}
export const showStatistic = new Statistic();
