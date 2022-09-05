import crudApi from "./CRUD/CrudApi";

export type idAfterGame = [string, boolean];

export interface IearnWord {
  difficulty: string;
  optional: { guessCount: number; isLearned: boolean };
}

class AddNewWord {
  addWord(arr: idAfterGame[]) {
    arr.forEach((el) => {
      this.isNewWord(el);
    });
  }

  async isNewWord(el: idAfterGame) {
    const isNew = await crudApi.getItem<IearnWord>(
      {
        endpoint: `/users/${JSON.parse(localStorage["user"]).userId}/words/${
          el[0]
        }`,
      },
      JSON.parse(localStorage["user"]).token
    );

    if (isNew === undefined) {
      el[1] ? this.createUserWord(el, 1) : this.createUserWord(el, 0);
    } else {
      if (!el[1]) {
        this.deleteWord(el);
      } else {
        this.UpdateUserWord(isNew, el[0]);
      }
    }
  }
  createUserWord(el: idAfterGame, count: number) {
    const newW: IearnWord = {
      difficulty: "easy",
      optional: { guessCount: count, isLearned: false },
    };
    crudApi.createItem(
      {
        endpoint: `/users/${JSON.parse(localStorage["user"]).userId}/words/${
          el[0]
        }`,
      },
      newW,
      JSON.parse(localStorage["user"]).token
    );
  }

  UpdateUserWord(oldWord: IearnWord, id: string) {
    const newInform: IearnWord = {
      difficulty: "easy",
      optional: { guessCount: 0, isLearned: false },
    };
    const numTrue: number = oldWord.optional.guessCount;
    const learn: boolean = oldWord.optional.isLearned;
    const whatWord: string = oldWord.difficulty;
    if (learn === false) {
      if (whatWord === "easy") {
        numTrue >= 2
          ? (newInform.optional.isLearned = true)
          : (newInform.optional.guessCount = numTrue + 1);
      } else {
        numTrue >= 4
          ? (newInform.optional.isLearned = true)
          : (newInform.optional.guessCount = numTrue + 1);
        newInform.difficulty = "hard";
      }

      crudApi.updateItems(
        {
          endpoint: `/users/${
            JSON.parse(localStorage["user"]).userId
          }/words/${id}`,
        },
        newInform,
        JSON.parse(localStorage["user"]).token
      );
    }
  }

  deleteWord(el: idAfterGame) {
    crudApi.deleteItem(
      {
        endpoint: `/users/${JSON.parse(localStorage["user"]).userId}/words/${
          el[0]
        }`,
      },
      JSON.parse(localStorage["user"]).token
    );
  }
}

export const addInApi = new AddNewWord();
