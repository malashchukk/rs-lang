import crudApi from "../controller/CRUD/CrudApi";
import preloader from "./preloader";
import IWords from "./IWords";
export default class WordRender {
  async renderCards(where: HTMLDivElement, pageNumber = 0, groupNumber = 0) {
    await this.createHTMLCards(where, pageNumber, groupNumber);
    preloader.init(
      document.querySelector(`.${where.className}`) as HTMLDivElement
    );
    this.addAudioEvent();
  }
  checkAuthorization() {
    if (!localStorage["user"]) {
      const wordsButtons = document.querySelectorAll(
        ".words-buttons"
      ) as NodeListOf<HTMLButtonElement>;
      wordsButtons.forEach((btn) => {
        btn.style.display = "none";
      });
    }
  }
  protected async createHTMLCards(
    container: HTMLDivElement,
    pageNumber = 0,
    group = 0
  ) {
    let cardsHtml = ``;
    await crudApi
      .getItem({
        endpoint: "/words",
        options: { page: pageNumber, group: group },
      })
      .then((data) => {
        const wordsInfo = data as IWords[];
        cardsHtml = wordsInfo.reduce((acc, curr) => {
          return (acc += this.createCard(curr));
        }, "");
      });
    container.innerHTML = cardsHtml;
    this.checkAuthorization();
  }
  createCard(wordInfo: IWords) {
    return `<div class="word-card" data-page="${wordInfo.page}" data-id="${
      wordInfo.id || wordInfo._id
    }" data-="${wordInfo.group}">
          <div class="word-card-aside"><img class="textbook__picture" src=${
            crudApi.baseLink
          }/${wordInfo.image}></div>
          <div class="word-card-main" data-id="${wordInfo.id || wordInfo._id}">
          <div class="words-info">
            <div class="textbook__word">${wordInfo.word}  <div class="audio">
            <img src="./assets/png/volume.png" class="audio-img">
            <audio controls preloader="none" class="textbook__audio" src="${
              crudApi.baseLink
            }/${wordInfo.audio}" type="audio/mpeg">
            </audio>
            <audio controls  preloader="none" class="textbook__audioMeaning" src="${
              crudApi.baseLink
            }/${wordInfo.audioMeaning}" type="audio/mpeg">
            </audio>
            <audio controls preloader="none" class="textbook__audioExample" src="${
              crudApi.baseLink
            }/${wordInfo.audioExample}" type="audio/mpeg">
            </audio>
          </div>
          <span class="word-transcription">${
            wordInfo.transcription
          }</span><span class="word-translate translate">${
      wordInfo.wordTranslate
    }</span></div>
            <div class="textbook__meaning">
            <div class="textMeaning">
              <span>${wordInfo.textMeaning}</span>
            </div>
            <span class="textbook__textMeaning-translate translate">${
              wordInfo.textMeaningTranslate
            }</span>
          </div>
            <div class="word__example">
            <span>${wordInfo.textExample}
            <span class="audio">
          </span>
            </span>
            <span class="textbook__example-translate translate">${
              wordInfo.textExampleTranslate
            }</span></div>
            </div>
            <div class="words-buttons">
            </div>
            <div class="word-card__message">
                сообщение
            </div>
          </div>
          </div>`;
  }

  addAudioEvent() {
    const audios = document.querySelectorAll(".audio");
    audios.forEach((div) =>
      div.addEventListener("click", () => {
        for (const i in div.children) {
          const audio = div.children[i] as HTMLAudioElement;
          const nextAudio = div.children[+i + 1] as HTMLAudioElement;
          const firstAudioNumber = 1;
          if (audio.tagName === "AUDIO") {
            if (+i === firstAudioNumber) {
              audio.play();
            }
            audio.addEventListener("ended", () => {
              if (audio.duration === audio.currentTime) {
                nextAudio.play();
              }
            });
          }
        }
      })
    );
  }
}
