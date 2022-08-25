import { Main } from "./components/view/main/main";
import { About } from "./components/view/aboutPage/aboutPage";
import "./style/style.scss";
import user from "./components/controller/authorization/authorization";
import popUp from "./components/view/popUpAuthorization/popUpAuthorization";
const aboutTeam = new About();
aboutTeam.ListenerBtnAbout();
const mainText = new Main();
popUp.replacePopUpButton("unauthorized");
mainText.showMain();
mainText.ListenerLogo();
user.isAuthorization();

//email: "roma@roma.com", password:"qwerty123";
