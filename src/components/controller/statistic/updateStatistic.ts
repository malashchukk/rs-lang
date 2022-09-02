import crudApi from "../CRUD/CrudApi";
import { IStatisticsStore } from "./IStatisticStore";

const newStatistic: IStatisticsStore = {
  learnedWords: 56,
  optional: {
    currentDate: new Date().toISOString().slice(0, 10),
    newWord: 3,
    correctAnswer: 9,
    sprint: {
      maxInRow: 6,
      correctAnswers: 5,
      wordsInGame: 5,
    },
    audioCall: {
      InRow: 6,
      rightAnswers: 9,
      wordInGame: 11,
    },
  },
};

async function loadStatistic(body: IStatisticsStore) {
  await crudApi.updateItems(
    {
      endpoint: `/users/${JSON.parse(localStorage["user"]).userId}/statistics`,
    },
    body,
    JSON.parse(localStorage["user"]).token
  );
}

loadStatistic(newStatistic);
