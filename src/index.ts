import { Main } from "./components/main/main";
import { About } from "./components/aboutPage/aboutPage";
import "./style/style.scss";
import user from "./components/app/authorization/authorization";
import popUp from "./components/view/authorization/popUpAuthorization";
const aboutTeam = new About();
aboutTeam.ListenerBtnAbout();
const mainText = new Main();
mainText.showMain();
mainText.ListenerLogo();
popUp.replacePopUpButton("unauthorized");
user.isAuthorization();

//email: "roma@roma.com", password:"qwerty123";
