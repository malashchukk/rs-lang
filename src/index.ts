import "./style/style.scss";
import "./components/controller/CRUD/CrudApi";
import "./components/controller/Router";
import "./components/view/renderTextbook";
import "./components/view/pagination";
import { Main } from "./components/view/main/main";
import { About } from "./components/view/aboutPage/aboutPage";
import user from "./components/controller/authorization/authorization";
import popUp from "./components/view/popUpAuthorization/popUpAuthorization";

import "./components/view/dictionary";
import router from "./components/controller/Router";
import sprintView from "./components/view/sprint/sprintView";
import sprint from "./components/controller/sprint/sprint";
import preloader from "./components/view/sprint/preloader";

const aboutTeam = new About();
router.add("about", () => aboutTeam.showAbout());
const mainText = new Main();
mainText.showMain();
router.add("home", () => mainText.showMain());
router.add("sprint", () => {
  if (!sessionStorage["fromTextbook"]) {
    sprintView.renderStartScreen();
  }
  sessionStorage["fromTextbook"] = "";
});

popUp.replacePopUpButton("unauthorized");
user.isAuthorization();
const sprintStartButton = document.querySelector(".nav_games_sprint");
sprintStartButton?.addEventListener("click", async () => {
  if (window.location.href.split("/").slice(-1)[0] === "textbook") {
    const sprintWrapper = document.querySelector(".main") as HTMLDivElement;
    preloader.init(sprintWrapper);
    localStorage["group"] = 2;
    localStorage["page"] = 2;
    sessionStorage["fromTextbook"] = true;
    window.location.assign(
      `${window.location.href.split("#")[0] + "#/sprint"}`
    );
    await sprint.startGameTextbook();
  } else {
    sessionStorage["fromTextbook"] = "";
    window.location.assign(
      `${window.location.href.split("#")[0] + "#/sprint"}`
    );
  }
});
