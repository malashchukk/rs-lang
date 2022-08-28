//import { startGame } from  './audioCall'
class AudioCallView{
    static instance: AudioCallView;  
    main = document.querySelector('.main') as HTMLElement;      

    constructor() {
        if (typeof AudioCallView.instance === 'object') {
            return AudioCallView.instance;
        }   
        AudioCallView.instance = this;
        return AudioCallView.instance;
    }   

    showStartPageAudioCall(){
        this.clearMainFooter()  
        this.main.innerHTML = `
        <div class="container_audioCall">       
            <h2 class="game_title">Аудиовызов</h2>
            <p class="game_description1">Тренировка Аудиовызов улучшает восприятие речи на слух.</p> 
            <p class="game_description2">Чтобы играть с помощью клавиатуры, используй клавиши
                1, 2, 3, 4, 5 - чтобы дать ответ,
                space - для воспроизведения звука,
                enter - чтобы пропустить вопрос,
                стрелка-вправо - чтобы перейти к следующему вопросу.</p>
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
            //startGame();            
        }

        clearMainFooter(){
            const footer = document.querySelector('.footer') as HTMLElement;
            footer.style.display = 'none'
        }

        renderGamePage(arrWordsRus:string[], wordEn:string, voiceEn:string, imageEn: string, wordRus:string){
            this.clearMainFooter()
            this.main.innerHTML = `
            <div class="game">
            <div class="game_progress"></div>
                <div class="container_audioCall">
                    <div class="game__image">
                        <div class="image image_audioCall">
                            <img src="http://localhost:8081/${imageEn}">
                        </div>
                    </div>
                    <div class="game__voice-word">
                        <div class="game__voice">
                          <img  src="./assets/svg/icon-audio.svg"  ${this.playSound(voiceEn)}>           
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
            `
        }
        playSound(voiceEn:string) {
            const audioElement = new Audio(`http://localhost:8081/${voiceEn}`);
            audioElement.play();
        }
      
}

