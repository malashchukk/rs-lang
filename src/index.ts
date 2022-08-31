import "./style/style.scss";
import "./components/controller/CRUD/CrudApi";
import { Main } from "./components/view/main/main";
import { About } from "./components/view/aboutPage/aboutPage";
import user from "./components/controller/authorization/authorization";
import popUp from "./components/view/popUpAuthorization/popUpAuthorization";
import router from "./components/controller/Router";
import sprintView from "./components/view/sprint/sprintView";
// import sprint from "./components/controller/sprint/sprint";

const aboutTeam = new About();
router.add("about", () => aboutTeam.showAbout());
const mainText = new Main();
router.add("home", () => mainText.showMain());

popUp.replacePopUpButton("unauthorized");
user.isAuthorization();

router.add("sprint", () => {
  sprintView.renderStartScreen();
  sprintView.renderCard();
});
