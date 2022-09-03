import "./style/style.scss";
import "./components/controller/CRUD/CrudApi";
import { Main } from "./components/view/main/main";
import { About } from "./components/view/aboutPage/aboutPage";
import user from "./components/controller/authorization/authorization";
import popUp from "./components/view/popUpAuthorization/popUpAuthorization";

const aboutTeam = new About();
aboutTeam.ListenerBtnAbout();
const mainText = new Main();
mainText.showMain();
mainText.ListenerLogo();

popUp.replacePopUpButton("unauthorized");
user.isAuthorization();
