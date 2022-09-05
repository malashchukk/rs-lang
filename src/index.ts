import "./style/style.scss";
import "./components/controller/CRUD/CrudApi";
import "./components/controller/Router";
import "./components/view/renderTextbook";
import "./components/view/pagination";
import { mainView } from "./components/view/main/main";
import { pageAbout } from "./components/view/aboutPage/aboutPage";
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
  if (!sessionStorage["FromTextbook"]) {
    sprintView.renderStartScreen();
  }
  sessionStorage["FromTextbook"] = "";
});

pageAbout.ListenerBtnAbout();

mainView.showMain();
mainView.ListenerLogo();

popUp.replacePopUpButton("unauthorized");
user.isAuthorization();
async function createGameButton(game: string, cb: () => Promise<void>) {
  const gameStartButton = document.querySelector(`.${game}`);
  gameStartButton?.addEventListener("click", async () => {
    if (window.location.href.split("/").slice(-1)[0] === "textbook") {
      const main = document.querySelector(".main") as HTMLDivElement;
      main.innerHTML = "";
      preloader.init(main);
      sessionStorage["FromTextbook"] = true;
      window.location.assign(
        `${window.location.href.split("#")[0] + `#/${game}`}`
      );
      await cb();
    } else {
      sessionStorage["FromTextbook"] = "";
      window.location.assign(
        `${window.location.href.split("#")[0] + `#/${game}`}`
      );
    }
  });
}
createGameButton("sprint", async () => {
  sprint.startGameTextbook();
});
createGameButton("audioCall", async () => {
  console.log(123);
});

// const sprintStartButton = document.querySelector(".nav_games_sprint");
// sprintStartButton?.addEventListener("click", async () => {
//   if (window.location.href.split("/").slice(-1)[0] === "textbook") {
//     const sprintWrapper = document.querySelector(".main") as HTMLDivElement;
//     preloader.init(sprintWrapper);
//     sessionStorage["FromTextbook"] = true;
//     window.location.assign(
//       `${window.location.href.split("#")[0] + "#/sprint"}`
//     );
// sprint.startGameTextbook();
//   } else {
//     sessionStorage["FromTextbook"] = "";
//     window.location.assign(
//       `${window.location.href.split("#")[0] + "#/sprint"}`
//     );
//   }
// });
