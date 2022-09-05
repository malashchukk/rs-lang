import crudApi from "../CRUD/CrudApi";
import {
  IStatisticsStore,
  statisticDefault,
  IGameStore,
  IInformStatistic,
} from "./IStatisticStore";
import { IearnWord } from "../learnWord";

class SetStatistic {
  learnWords = 0;
  newStatistic: IStatisticsStore = statisticDefault;
  inform: IInformStatistic;

  constructor() {
    if (localStorage["statistic"]) {
      this.inform = JSON.parse(localStorage["statistic"]);
    } else {
      this.inform = {
        newWordsSpirit: [],
        newWordsAudioCall: [],
        allAnswerSpirit: 0,
        allAnswerAudioCall: 0,
        trueAnswersSpirit: 0,
        trueAnswersAudioCall: 0,
        rowSpirit: 0,
        rowAudioCall: 0,
      };
    }
  }

  loadStatistic() {
   // console.log(this.newStatistic);
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
    this.newStatistic = statisticDefault;
    this.inform.newWordsSpirit = [];
    this.inform.newWordsAudioCall = [];
    this.inform.allAnswerSpirit = 0;
    this.inform.allAnswerAudioCall = 0;
    this.inform.trueAnswersSpirit = 0;
    this.inform.trueAnswersAudioCall = 0;
  }

  collectStatistic() {
    if (
      this.newStatistic.optional.currentDate !==
      new Date().toISOString().slice(0, 10)
    ) {
      this.clearStatistics();
    }
    this.getNewWord();
    this.getTrueAnswer();
    this.getLearnedWord();
    localStorage["statistic"] = JSON.stringify(this.inform);
  }

  async getLearnedWord() {
    let countLearn = 0;

    const word: IearnWord[] = await crudApi.getItem(
      {
        endpoint: `/users/${JSON.parse(localStorage["user"]).userId}/words`,
      },
      JSON.parse(localStorage["user"]).token
    );   
    if (word.length === 0) {
      this.newStatistic.learnedWords = 0;
    } else {
      word.forEach((item: IearnWord) => {
        const { optional, difficulty } = item;
        if (optional.isLearned || difficulty ==='easy') {
          countLearn += 1;
        }
      });
    }
    this.newStatistic.learnedWords = countLearn;
    console.log("изученных в статистике", countLearn)
    this.loadStatistic();
  }

  async getNewWord() {
    const stat = this.newStatistic.optional;
    stat.sprint.wordsInGame = new Set(this.inform.newWordsSpirit).size;
    stat.audioCall.wordsInGame = new Set(this.inform.newWordsAudioCall).size;    
    stat.newWord = new Set([
      ...this.inform.newWordsSpirit,
      ...this.inform.newWordsAudioCall,
    ]).size;
    stat.sprint.maxInRow = this.inform.rowSpirit;
    stat.audioCall.maxInRow = this.inform.rowAudioCall;
  }

  // async getAllNewWord() {
  //   const allNewWord: IearnWord[] = await crudApi.getItem(
  //     {
  //       endpoint: `/users/${JSON.parse(localStorage["user"]).userId}/words`,
  //     },
  //     JSON.parse(localStorage["user"]).token
  //   );
  //   return allNewWord.length ? allNewWord.length : 0;
  // }

  getTrueAnswer() {
    const stat = this.newStatistic.optional;
    stat.sprint.trueAnswers = this.getPercent(
      this.inform.trueAnswersSpirit,
      this.inform.allAnswerSpirit
    );
    stat.audioCall.trueAnswers = this.getPercent(
      this.inform.trueAnswersAudioCall,
      this.inform.allAnswerAudioCall
    );
    const allAnswer =
      this.inform.allAnswerSpirit + this.inform.allAnswerAudioCall;
    const allCorAn =
      this.inform.trueAnswersSpirit + this.inform.trueAnswersAudioCall;
    stat.trueAnswer = this.getPercent(allCorAn, allAnswer);
  }

  getPercent(correct: number, all: number) {
    const res = (correct * 100) / all;
    return Math.round(res ? res : 0);
  }

  updateStatisticGame(gameType: IGameStore) {
    if (gameType.name === "sprint") {
      const sprint = this.newStatistic.optional.sprint;
      this.inform.rowSpirit =
        this.inform.rowSpirit > gameType.maxInRow
          ? this.inform.rowSpirit
          : gameType.maxInRow;
      this.inform.trueAnswersSpirit += gameType.trueAnswers;
      this.inform.allAnswerSpirit += 20;
      this.inform.newWordsSpirit = [
        ...this.inform.newWordsSpirit,
        ...(gameType.arrayAllWord || []),
      ];
      sprint.points = gameType.points;
    } else {
      const audioCall = this.newStatistic.optional.audioCall;
      this.inform.rowAudioCall =
        this.inform.rowAudioCall > gameType.maxInRow
          ? this.inform.rowAudioCall
          : gameType.maxInRow;
      this.inform.trueAnswersAudioCall += gameType.trueAnswers;
      this.inform.allAnswerAudioCall += 20;
      this.inform.newWordsAudioCall = [
        ...this.inform.newWordsAudioCall,
        ...(gameType.arrayAllWord || []),
      ];
      audioCall.points = gameType.points;
    }
    this.collectStatistic();
  }
}

export const updateStat = new SetStatistic();


