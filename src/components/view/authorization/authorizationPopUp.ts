import { User } from "../../app/authorization/authorization";

class PopUp extends User {
  createPopUp() {
    const body = document.body;
    const popUpHTML = document.createElement("div");
    popUpHTML.classList.add("popup-wrapper");
    const popUp = document.createElement("div");
    popUp.classList.add("popup");
    const popUpCloseButton = document.createElement("a");
    popUpCloseButton.innerHTML = "&times";
    popUpCloseButton.classList.add("popup__close");
    popUpCloseButton.addEventListener("click", () => {
      body.style.overflow = "auto";
      popUp.classList.toggle("active");
      popUpBackground.classList.toggle("popup__background");
    });
    popUp.innerHTML += `
    <h1>This is a popup!</h1>
    <p></p>
    `;
    popUp.append(popUpCloseButton);
    const popUpBackground = document.createElement("div");
    popUpBackground.addEventListener("click", () => {
      body.style.overflow = "auto";
      popUp.classList.toggle("active");
      popUpBackground.classList.toggle("popup__background");
    });
    const openPopUpButton = document.createElement("a");
    openPopUpButton.classList.add("open-popup__button");
    openPopUpButton.innerHTML = "Войти";
    openPopUpButton.addEventListener("click", () => {
      body.style.overflow = "hidden";
      popUp.classList.toggle("active");
      popUpBackground.classList.toggle("popup__background");
    });
    popUpHTML.append(openPopUpButton);
    popUpHTML.append(popUpBackground);
    popUpHTML.append(popUp);
    const signIn = document.querySelector(".btn-logoin");
    signIn?.replaceWith(popUpHTML);
  }

  // createLogIn(){

  // }
  // signUp(){

  // }
}
const popUp = new PopUp();
export default popUp;
