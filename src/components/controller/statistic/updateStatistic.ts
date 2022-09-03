import crudApi from "../CRUD/CrudApi";
import {
  IStatisticsStore /*, statisticDefault */,
  IGameStore,
} from "./IStatisticStore";

// const newStatistic: IStatisticsStore = {
//   learnedWords: 56,
//   optional: {
//     currentDate: new Date().toISOString().slice(0, 10),
//     newWord: 3,
//     correctAnswer: 9,
//     sprint: {
//       maxInRow: 6,
//       correctAnswers: 5,
//       wordsInGame: 5,
//     },
//     audioCall: {
//       InRow: 6,
//       rightAnswers: 9,
//       wordInGame: 11,
//     },
//   },
// };

class SetStatistic {
  newStatistic: IStatisticsStore = {
    learnedWords: 0,
    optional: {
      currentDate: new Date().toISOString().slice(0, 10),
      newWord: 0,
      correctAnswer: 0,
      sprint: {
        maxInRow: 0,
        correctAnswers: 0,
        wordsInGame: 0,
      },
      audioCall: {
        maxInRow: 0,
        correctAnswers: 0,
        wordsInGame: 0,
      },
    },
  };

  loadStatistic() {
    crudApi.updateItems(
      {
        endpoint: `/users/${
          JSON.parse(localStorage["user"]).userId
        }/statistics`,
      },
      this.newStatistic,
      JSON.parse(localStorage["user"]).token
    );
  }

  clearStatistics() {
    // Object.entries(statisticDefault).forEach(([key, value]) => {
    //   this.newStatistic[key] = value;
    // });
  }

  updateStatisticGame(gameType: IGameStore) {
    if (gameType.name && gameType.name === "sprint") {
      const sprint = this.newStatistic.optional.sprint;
      sprint.correctAnswers += gameType.correctAnswers;
      sprint.maxInRow =
        sprint.maxInRow > gameType.maxInRow
          ? sprint.maxInRow
          : gameType.maxInRow;
    } else {
      const audioCall = this.newStatistic.optional.audioCall;
      audioCall.correctAnswers += gameType.correctAnswers;
      audioCall.maxInRow =
        audioCall.maxInRow > gameType.maxInRow
          ? audioCall.maxInRow
          : gameType.maxInRow;
    }
  }
}

export const updateStatistic = new SetStatistic();
