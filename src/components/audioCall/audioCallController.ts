import './audioCallStyle.scss'
import crudApi from '../controller/CRUD/CrudApi';
import {Main} from '../main/main';
import {renderGamePage, showResultGame} from './audioCallView'

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



let progressWidth = 0;
let level:number = 0;
let page: number = 0;
let myDataWords:wordOne[] = [];
let arrWordsRus:string[] = [];
let countNumberWord = 0
export const arrTrueAnswer:string[] = [];
export const arrFalseAnswer:string[] = [];

const progressStep = 5;
const reserveArr: string[] = ['хобби','больница', 'дверь', 'команда', 'нога', 'животное','желание', 'оплата', 'компромисс', 'невинность', 'скорость', 'бремя'];


    

export function listenerCloseBtn(){
    const close = document.querySelector('.close_btn') as HTMLElement;
    close.addEventListener('click', () => {
          const mainPage = new Main();/***********************************fix********************** */
          mainPage.showMain()
    }); 
}
export function getLevel(){
    const selectLevel = document.querySelector('.lvl-select') as HTMLSelectElement; 
    level = +selectLevel.value - 1;     
}
    
export async function initAudioCallGame(){
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
        let targetParent = (event.target as HTMLElement).parentElement as HTMLElement;
        if ((targetParent as HTMLElement).className === 'words__item') {
        gameWords.classList.add('active');
        countNumberWord += 1;
        giveAnswer(wordTranslate, word, targetParent);
        }       
    });  

    const gameBtn = document.querySelector('.game .game__btn.button') as HTMLElement;
    gameBtn.addEventListener('click', (event) => {        
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


function createAudio(way:string){
    let audioElement = new Audio(way);
    audioElement.play(); 
} 

function giveAnswer(wordTranslate:string, word:string, event: HTMLElement) { 
    const gameBtn = document.querySelector('.game__btn') as HTMLElement;      
    const getWordRusText = (event.lastElementChild as HTMLElement).innerHTML;    
    const allWords = document.querySelectorAll('.words__item');
    const imgAnswer = document.querySelector('.container_audioCall') as HTMLElement;

        progressWidth += progressStep;
        progressGame(progressWidth); 
    
     imgAnswer.classList.add('active'); 

    if (getWordRusText === wordTranslate) {
        arrTrueAnswer.push(word);
        createAudio("../../assets/audio/audio_correct.mp3")              
        
        allWords.forEach((element:any) => { /*************************************fix********any*********************/
        //console.log(element)
        element.classList.remove('true');
        element.classList.add('false');        
        });
        event.classList.remove('false');
        event.classList.add('true');
    } else {
        arrFalseAnswer.push(word);
        createAudio("../../../assets/audio/audio_error.mp3")
               
        allWords.forEach((element:any) => { /************************************fix*********any*********************/
        element.classList.add('false');       
        if (wordTranslate === element.lastElementChild.outerText) {
            element.classList.add('true');
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
    progressBarTop.style.transition = '0.6s';
    progressBarTop.style.width = `${width}%`;
  }


function showAnswerIfClickDontKnow(wordTranslate:string, word:string){
    const gameBtn = document.querySelector('.game__btn') as HTMLElement;
    const allWords = document.querySelectorAll('.words__item');
    const imgAnswer = document.querySelector('.container_audioCall') as HTMLElement;  
    imgAnswer.classList.add('active');
    arrFalseAnswer.push(word);

    progressWidth += progressStep;
    progressGame(progressWidth); 
    allWords.forEach((e:any) => { /**********************************fix***********any*********************/
    e.classList.add('false');       
    if (wordTranslate === e.lastElementChild.outerText) {
        e.classList.add('true');
    }
    });
    createAudio("../../../assets/audio/audio_error.mp3")
    gameBtn.innerText = 'Далее';
}



function keyPress(event:KeyboardEvent) { 
           
    const word = (document.querySelector('.game__word') as HTMLElement).outerText;
    const wordTranslate = (document.querySelector('.game__word_rus') as HTMLElement).outerText;
    const gameNumber = document.querySelectorAll('.words__item') as NodeList;
    const keyDown = event.key;   
    const gameBtn = document.querySelector('.game .game__btn.button') as HTMLElement;
    const game = document.querySelector('.container_audioCall') as HTMLElement;
    
    if (keyDown === ' ' && gameBtn.outerText === 'Далее') {
        initAudioCallGame();
    }
    
    if (!game.classList.contains('active')) {
      gameNumber.forEach((number: any) => { /*******************fix******any***************** */      
        if (number.firstElementChild.outerText === keyDown) {
          countNumberWord += 1;                
          giveAnswer(wordTranslate, word, number);
        } else if (keyDown === ' ' && gameBtn.outerText === 'Не знаю') {
          showAnswerIfClickDontKnow(wordTranslate, word)
          countNumberWord += 1;
        }
      });
    }  
  }
  



