import { Registration } from "./components/registration/registrationForm";
import { Main } from "./components/main/main";
import { About } from "./components/aboutPage/aboutPage";

const aboutTeam = new About();
aboutTeam.ListenerBtnAbout();
const mainText = new Main();
mainText.showMain();
mainText.ListenerLogo();
const register = new Registration();
register.ListenerBtn();
