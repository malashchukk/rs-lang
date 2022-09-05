import "./audioCallStyle.scss";
import { gameController } from "../../controller/audioCall/audioCallController";
import router from "../../controller/Router";

class AudioCallView {
  main = document.querySelector(".main") as HTMLElement;

  showStartPageAudioCall() {
    this.clearMainFooter("none");
    this.main.innerHTML = `
        <div class="container_audioCall">       
            <h2 class="game_title">Аудиовызов</h2>
            <p class="game_description1">Тренировка Аудиовызов улучшает восприятие речи на слух.</p> 
            <p class="game_description2">Чтобы играть с помощью клавиатуры, используй клавиши
                1, 2, 3, 4, 5 - чтобы дать ответ,
                пробел - чтобы пропустить вопрос.</p>
                <div class="game_inform_level">
                    <div class="game_inform_level_text">Выбери уровень сложности:</div>       
                    <select class="lvl-select" name="level"> 
                        <option value="1" selected>1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select><br>
                </div>
                
            <button class="btn_start_audio_call">Начать</button>
                   
            <div class="game_start"></div>
            <div class="close_btn">
            <img src="./assets/svg/cross.svg">        
            </div>
        </div>      
            `;
    const btnStartGameAudioCall = document.querySelector(
      ".btn_start_audio_call"
    ) as HTMLElement;
    btnStartGameAudioCall?.addEventListener("click", () => {
      gameController.getLevel();
      gameController.startGame();
    });
    gameController.listenerCloseBtn();
  }

  renderGamePage(
    arrWordsRus: string[],
    wordEn: string,
    voiceEn: string,
    imageEn: string,
    wordRus: string
  ) {
    this.clearMainFooter("none");
    this.main.innerHTML = `
        <div class="game">
        <div class="close_btn">
            <img src="./assets/svg/cross.svg">        
        </div>
        <div class="game_progress"></div>
            <div class="container_audioCall">
                <div class="game__image">
                    <div class="image image_audioCall">
                        <img class="img_word" src="https://rslang-malashchukk.herokuapp.com/${imageEn}">
                    </div>
                </div>
                <div class="game__voice-word">
                    <div class="game__voice">
                        <img  src="./assets/png/volume.png"  ${this.playSound(
                          voiceEn
                        )}>           
                    </div>          
                <div class="game__word">${wordEn}</div>
                <div class="game__word_rus">${wordRus}</div>
                </div><div class="game__words words">
                <div class="words__item">
                    <div class="words__number">1</div>
                    <div class="words__name">${arrWordsRus[0]}</div>
                </div>
                <div class="words__item">
                    <div class="words__number">2</div>
                    <div class="words__name">${arrWordsRus[1]}</div>
                </div><div class="words__item">
                    <div class="words__number">3</div>
                    <div class="words__name">${arrWordsRus[2]}</div>
                </div><div class="words__item">
                    <div class="words__number">4</div>
                    <div class="words__name">${arrWordsRus[3]}</div>
                </div><div class="words__item">
                    <div class="words__number">5</div>
                    <div class="words__name">${arrWordsRus[4]}</div>
                </div>
                </div>
                <div class="game__btn button">Не знаю</div>
            </div>
        </div>
        `;
  }
  playSound(voiceEn: string) {
    const audioElement = new Audio(
      `https://rslang-malashchukk.herokuapp.com/${voiceEn}`
    );
    audioElement.play();
  }
  showResultGame(point: number, percent: number) {
    this.clearMainFooter("none");
    this.main.innerHTML = `
        <div class="games_result_wrapper">       
            <div class="games_result">
              <div class="game-results">
                <p class="game-results_title">Твой результат ${point} очков</p>
                <div class="percent">
                  <div class="morph-shape" id="morph-shape">               
                    <div class="result">${percent}%</div>
                  </div>
                </div>
                <div class="game-results_inform">
                  <div class="inform_item">
                    <h2 class="inform_title_know">Знаю:</h2>
                    <ul class="word_know">                   
                    </ul>
                  </div>
                  <div class="inform_item">
                    <h2 class="inform_title_mistake">Ошибки:</h2>
                    <ul class="word_mistake">                 
                    </ul>
                  </div>              
              </div>
              <button class="close_result_game">Закрыть</button>
            </div>`;
    this.generateLi(gameController.arrTrueAnswer, "known_item", "word_know");
    this.generateLi(
      gameController.arrFalseAnswer,
      "mistake_item",
      "word_mistake"
    );
  }
  generateLi(array: string[], classnames: string, selector: string) {
    const ul = document.querySelector(`.${selector}`) as HTMLElement;
    for (let i = 0; i < array.length; i++) {
      const li = document.createElement("li");
      li.className = `${classnames}`;
      li.innerText = `${array[i]}`;
      ul.append(li);
    }
  }
  clearMainFooter(meaning: string) {
    const footer = document.querySelector(".footer") as HTMLElement;
    footer.style.display = `${meaning}`;
  }
}

export const audioCallView = new AudioCallView();

router.add("audioCall", () => {
  audioCallView.showStartPageAudioCall();
});
