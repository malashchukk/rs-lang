import './audioCallStyle.scss'
import crudApi from '../controller/CRUD/CrudApi';
import {Main} from '../main/main';


const main = document.querySelector('.main') as HTMLElement;

let progressWidth = 0;
let level:number = 0;
let page: number = 0;
let myDataWords:wordOne[] = [];
let arrWordsRus:string[] = [];
let countNumberWord = 0
const arrTrueAnswer:string[] = [];
const arrFalseAnswer:string[] = [];

const progressStep = 5;
const reserveArr: string[] = ['хобби','больница', 'дверь', 'команда', 'нога', 'животное','желание', 'оплата', 'компромисс', 'невинность', 'скорость', 'бремя'];

function clearMainFooter(){
    const footer = document.querySelector('.footer') as HTMLElement;
    footer.style.display = 'none'
}
    
export function showStartPageAudioCall(){
    clearMainFooter()  
    main.innerHTML = `
    <div class="container_audioCall">       
        <h2 class="game_title">Аудиовызов</h2>
        <p class="game_description1">Тренировка Аудиовызов улучшает восприятие речи на слух.</p> 
        <p class="game_description2">Чтобы играть с помощью клавиатуры, используй клавиши
            1, 2, 3, 4, 5 - чтобы дать ответ,
            enter - чтобы пропустить вопрос.</p>
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
    const btnStartGameAudioCall = document.querySelector('.btn_start_audio_call') as HTMLElement;    
    btnStartGameAudioCall?.addEventListener('click', ()=>{            
          getLevel();
          initAudioCallGame()                 
    })   
    listenerCloseBtn() 
    }
function listenerCloseBtn(){
    const close = document.querySelector('.close_btn') as HTMLElement;
    close.addEventListener('click', () => {
          const mainPage = new Main();/***********************************fix********************** */
          mainPage.showMain()
    }); 
}
function getLevel(){
    const selectLevel = document.querySelector('.lvl-select') as HTMLSelectElement; 
    level = +selectLevel.value - 1;     
}
    
async function initAudioCallGame(){
    if(countNumberWord < 20){
        arrWordsRus.length = 0
    myDataWords = await crudApi.getItem<wordOne[]>({ endpoint: `/words?group=${level}&page=${page}`})    
      //const {word, image, audio, wordTranslate} = myDataWords[countNumberWord]?;
      const word: any = myDataWords[countNumberWord]?.word;/***************************any */
      const audio: any = myDataWords[countNumberWord]?.audio;/***************************any */
      const image: any =  myDataWords[countNumberWord]?.image;/***************************any */
      const wordTranslate:any = myDataWords[countNumberWord]?.wordTranslate /***************************any */
      
      arrWordsRus.push(wordTranslate);      
      createArrayRusWord();      
      renderGamePage(arrWordsRus, word, audio, image, wordTranslate) 
       
    const audioBtn = document.querySelector('.game__voice') as HTMLElement;
    audioBtn.addEventListener('click', () => {
        createAudio(`http://localhost:8081/${audio}`)         
        });
          
    const gameWords = document.querySelector('.game__words') as HTMLElement;
    gameWords.addEventListener('click', (event) => {
        progressWidth += progressStep;
        progressGame(progressWidth); 
        let targetParent = (event.target as HTMLElement).parentElement 
        if ((targetParent as HTMLElement).className === 'words__item') {
        gameWords.classList.add('active');
        countNumberWord += 1;
        giveAnswer(wordTranslate, word, targetParent);
        }
        if ((targetParent as HTMLElement).className === 'game__words words') {
        gameWords.classList.add('active');
        countNumberWord += 1;        
        giveAnswer(wordTranslate, word, event.target);
        }
    });  

    const gameBtn = document.querySelector('.game .game__btn.button') as HTMLElement;
    gameBtn.addEventListener('click', (event) => {
        progressWidth += progressStep;
        progressGame(progressWidth); 
        if ((event.target as HTMLElement).outerText === 'Не знаю') {
          showAnswerIfClickDontKnow(wordTranslate, word);
          countNumberWord += 1;
        } else {
            initAudioCallGame()
        }
      });

      document.addEventListener('keydown', (event)=>{
        progressWidth += progressStep;
        progressGame(progressWidth); 
        keyPress(event);
      });
      
      listenerCloseBtn()
    } else{ 
        showResultGame()
    }         
    }

function showResultGame(){
    console.log(arrFalseAnswer,arrTrueAnswer)
    let point = arrTrueAnswer.length*100
    let percent = arrTrueAnswer.length/20*100
    clearMainFooter()  
    main.innerHTML = `
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
        </div>`
        generateLi(arrTrueAnswer, 'known_item', 'word_know');
        generateLi(arrFalseAnswer, 'mistake_item', 'word_mistake')
}
function generateLi(array:string[], classname: string, selector:string){    
    const ul = document.querySelector(`.${selector}`) as HTMLElement;
    for(let i = 0; i < array.length; i++){
        const li = document.createElement('li');
        li.className = `${classname}`;
        li.innerText = `${array[i]}`
        ul.append(li)
    }      
}

function createAudio(way:string){
    let audioElement = new Audio(way);
    audioElement.play(); 
} 

function giveAnswer(wordTranslate:string, word:string, event: any) { /****************fix******any*******/
    const gameBtn = document.querySelector('.game__btn') as HTMLElement;      
    const getWordRusText = (event.lastElementChild as HTMLElement).innerHTML;    
    const allWords = document.querySelectorAll('.words__item');
    const imgAnswer = document.querySelector('.container_audioCall') as HTMLElement;
  
     imgAnswer.classList.add('active'); 

    if (getWordRusText === wordTranslate) {
        arrTrueAnswer.push(word);
        createAudio("../../assets/audio/audio_correct.mp3")              
        
        allWords.forEach((e:any) => { /*************************************fix********any*********************/
        e.classList.remove('true');
        e.classList.add('false');        
        });
        event.classList.remove('false');
        event.classList.add('true');
    } else {
        arrFalseAnswer.push(word);
        createAudio("../../../assets/audio/audio_error.mp3")
               
        allWords.forEach((e:any) => { /************************************fix*********any*********************/
        e.classList.add('false');       
        if (wordTranslate === e.lastElementChild.outerText) {
            e.classList.add('true');
        }
        });
        
        event.classList.add('line-through');
    }
    gameBtn.innerText = 'Далее';   
    
    }
    


function createArrayRusWord(){
    let countOtherRusWord = 4    
    randomSort(reserveArr);
    reserveArr.forEach(e => arrWordsRus.push(e));    
    arrWordsRus = arrWordsRus.slice(0, countOtherRusWord + 1);
    randomSort(arrWordsRus)    
}

function randomSort (array:string[]) {
    array.sort(() => Math.random() - 0.5);
    
}

function progressGame(width: number) {    
    const progressBarTop = document.querySelector('.game_progress') as HTMLElement;   
   console.log(width, progressBarTop.style.width)
    progressBarTop.style.transition = '0.6s';
    progressBarTop.style.width = `${width}%`;
  }


function showAnswerIfClickDontKnow(wordTranslate:string, word:string){
    const gameBtn = document.querySelector('.game__btn') as HTMLElement;
    const allWords = document.querySelectorAll('.words__item');
    const imgAnswer = document.querySelector('.container_audioCall') as HTMLElement;  
    imgAnswer.classList.add('active');
    arrFalseAnswer.push(word);
    allWords.forEach((e:any) => { /**********************************fix***********any*********************/
    e.classList.add('false');       
    if (wordTranslate === e.lastElementChild.outerText) {
        e.classList.add('true');
    }
    });
    createAudio("../../../assets/audio/audio_error.mp3")
    gameBtn.innerText = 'Далее';
}
function renderGamePage(arrWordsRus:string[], wordEn:string, voiceEn:string, imageEn: string, wordRus:string){
    clearMainFooter()
    main.innerHTML = `
    <div class="game">
    <div class="close_btn">
        <img src="./assets/svg/cross.svg">        
    </div>
    <div class="game_progress"></div>
        <div class="container_audioCall">
            <div class="game__image">
                <div class="image image_audioCall">
                    <img src="http://localhost:8081/${imageEn}">
                </div>
            </div>
            <div class="game__voice-word">
                <div class="game__voice">
                  <img  src="./assets/svg/icon-audio.svg"  ${playSound(voiceEn)}>           
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


function keyPress(event:KeyboardEvent) {        
    const word = (document.querySelector('.game__word') as HTMLElement).outerText;
    const wordTranslate = (document.querySelector('.game__word_rus') as HTMLElement).outerText;
    const gameNumber = document.querySelectorAll('.words__item') as NodeList;
    const keyDown = event.key;   
    const gameBtn = document.querySelector('.game .game__btn.button') as HTMLElement;
    const game = document.querySelector('.container_audioCall') as HTMLElement;
  
  
    if (keyDown === 'Enter' && gameBtn.outerText === 'Далее') {
        initAudioCallGame();
    }
    
    if (!game.classList.contains('active')) {
      gameNumber.forEach((number: any) => { /*******************fix******any***************** */      
        if (number.firstElementChild.outerText === keyDown) {
          countNumberWord += 1;                
          giveAnswer(wordTranslate, word, number);
        } else if (keyDown === 'Enter' && gameBtn.outerText === 'Не знаю') {
          showAnswerIfClickDontKnow(wordTranslate, word)
          countNumberWord += 1;
        }
      });
    }  
  }
  

function playSound(voiceEn:string) {
    const audioElement = new Audio(`http://localhost:8081/${voiceEn}`);
    audioElement.play();
}



type wordOne = {
    id:	string;
    group:	number;
    page:	number;
    word:	string;
    image:	string;
    audio:	string;
    audioMeaning:	string;
    audioExample:	string;
    textMeaning:	string;
    textExample:	string;
    transcription:	string;
    wordTranslate:	string;
    textMeaningTranslate:	string;
    textExampleTranslate:	string;
}

