// import { Registration } from "./components/registration/registrationForm";
import { Main } from "./components/main/main";
import { About } from "./components/aboutPage/aboutPage";
import "./style/style.scss";
import popUp from "./components/view/authorization/authorizationPopUp";
import user from "./components/app/authorization/authorization";
// import router from "./components/controller/Router";
const aboutTeam = new About();
aboutTeam.ListenerBtnAbout();
const mainText = new Main();
mainText.showMain();
mainText.ListenerLogo();

popUp.replacePopUpButton("unauthorized");

// const register = new Registration();
// register.ListenerBtn();
// async function test() {
//   await user.logIn({ email: "roma@roma.com", password: "qwerty123" });
//   await user.updateToken();
// }
user.logIn({ email: "roma@roma.com", password: "qwerty123" });
// test();
// user.isAuthorization();
//email: "roma@roma.com", password:"qwerty123";
