import "./style/style.scss";
import "./components/controller/CRUD/CrudApi";
import { Main } from "./components/view/main/main";
import { About } from "./components/view/aboutPage/aboutPage";
import user from "./components/controller/authorization/authorization";
import popUp from "./components/view/popUpAuthorization/popUpAuthorization";
import router from "./components/controller/Router";
import sprintView from "./components/view/sprint/sprintView";

const aboutTeam = new About();
router.add("about", () => aboutTeam.showAbout());
const mainText = new Main();
mainText.showMain();
router.add("home", () => mainText.showMain());

popUp.replacePopUpButton("unauthorized");
user.isAuthorization();
const sprintStartButton = document.querySelector(".nav_games_sprint");
sprintStartButton?.addEventListener("click", async () => {
  if (window.location.href.split("/").slice(-1)[0] === "textbook") {
    // await sprintView.renderCard(); // TODO
  }
});
router.add("sprint", () => {
  const curSprint = document.querySelector(".sprint-game");
  if (!curSprint) {
    sprintView.renderStartScreen();
    // sprint.level = Math.floor(Math.random() * 6);
    // sprint.startGame();
  }
});
