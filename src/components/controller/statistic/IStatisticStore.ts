export interface IStatisticsStore {
  learnedWords: number;
  optional: {
    currentDate: string;
    newWord: number;
    correctAnswer: number;
    sprint: {
      maxInRow: number;
      correctAnswers: number;
      wordsInGame: number;
    };
    audioCall: {
      InRow: number;
      rightAnswers: number;
      wordInGame: number;
    };
  };
}

export const statisticDefault: IStatisticsStore = {
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
      InRow: 0,
      rightAnswers: 0,
      wordInGame: 0,
    },
  },
};
