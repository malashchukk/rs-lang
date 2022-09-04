export interface IGameStore {
  name?: string;
  arrayAllWord?: string[];
  points: number;
  maxInRow: number;
  trueAnswers: number;
  wordsInGame?: number;
}

export interface IStatisticsStore {
  learnedWords: number;
  optional: {
    currentDate: string;
    newWord: number;
    trueAnswer: number;
    sprint: IGameStore;
    audioCall: IGameStore;
  };
}

export const statisticDefault: IStatisticsStore = {
  learnedWords: 0,
  optional: {
    currentDate: new Date().toISOString().slice(0, 10),
    newWord: 0,
    trueAnswer: 0,
    sprint: {
      maxInRow: 0,
      trueAnswers: 0,
      wordsInGame: 0,
      points: 0,
    },
    audioCall: {
      maxInRow: 0,
      trueAnswers: 0,
      wordsInGame: 0,
      points: 0,
    },
  },
};

export interface IInformStatistic {
  newWordsSpirit: string[];
  newWordsAudioCall: string[];
  allAnswerSpirit: number;
  allAnswerAudioCall: number;
  trueAnswersSpirit: number;
  trueAnswersAudioCall: number;
  rowSpirit: number;
  rowAudioCall: number;
}
