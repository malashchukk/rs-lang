import crudApi from "../controller/CRUD/CrudApi";
import preloader from "./preloader";
import IWords from "./IWords";

export default class WordRender {
  async renderCards(where: HTMLDivElement, pageNumber = 0, groupNumber = 0) {
    await this.htmlCards(where, pageNumber, groupNumber);
    preloader.show(
      document.querySelector(".textbook__words-wrapper") as HTMLDivElement
    );
    preloader.hide(
      document.querySelector(".textbook__words-wrapper") as HTMLDivElement
    );
    this.addAudioEvent();
  }
  protected async htmlCards(
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
        const words = data as IWords[];
        cardsHtml = words.reduce((acc, curr) => {
          return (acc += `<div class="word-card" data-page="${curr.page} data-id="${curr.id}" data-="${curr.group}">
          <div class="word-card-aside"><img class="textbook__picture" src=${crudApi.baseLink}/${curr.image}></div>
          <div class="word-card-main" data-id="${curr.id}">
          <div class="words-info">
            <div class="textbook__word">${curr.word}  <div class="audio">
            <img src="./assets/png/volume.png" class="audio-img">
            <audio controls preloader="none" class="textbook__audio" src="${crudApi.baseLink}/${curr.audio}" type="audio/mpeg">
            </audio>
          </div>
          <span class="word-transcription">${curr.transcription}</span><span class="word-translate translate">${curr.wordTranslate}</span></div>
            <div class="textbook__meaning">
            <div class="textMeaning">
              <span>${curr.textMeaning}</span>
              <span class="audio">
                <img src="./assets/png/volume.png" class="audio-img">
                <audio controls  preloader="none" class="textbook__audioMeaning" src="${crudApi.baseLink}/${curr.audioMeaning}" type="audio/mpeg">
                </audio>
              </span>
            </div>
            <span class="textbook__textMeaning-translate translate">${curr.textMeaningTranslate}</span>
          </div>
            <div class="word__example">
            <span>${curr.textExample}
            <span class="audio">
            <img src="./assets/png/volume.png" class="audio-img">
            <audio controls preloader="none" class="textbook__audioExample" src="${crudApi.baseLink}/${curr.audioExample}" type="audio/mpeg">
            </audio>
          </span>
            </span>
            <span class="textbook__example-translate translate">${curr.textExampleTranslate}</span></div>
            </div>
            <div class="words-buttons">
            </div>
            <div class="word-card__message">
                сообщение
            </div>
          </div>
          </div>`);
        }, "");
      });
    container.innerHTML = cardsHtml;
  }

  protected addAudioEvent() {
    const audios = document.querySelectorAll(".audio");
    audios.forEach((div) =>
      div.addEventListener("click", () => {
        for (const i of div.children) {
          if (i.tagName === "AUDIO") {
            const audio = i as HTMLAudioElement;
            audio.play();
          }
        }
      })
    );
  }
}
