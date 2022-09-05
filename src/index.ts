import "./style/style.scss";
import "./components/controller/CRUD/CrudApi";
import "./components/controller/Router";
import "./components/view/renderTextbook";
import "./components/view/pagination";
import { mainView } from "./components/view/main/main";
import { pageAbout } from "./components/view/aboutPage/aboutPage";
import user from "./components/controller/authorization/authorization";
import popUp from "./components/view/popUpAuthorization/popUpAuthorization";


pageAbout.ListenerBtnAbout();

mainView.showMain();
mainView.ListenerLogo();

popUp.replacePopUpButton("unauthorized");
user.isAuthorization();
