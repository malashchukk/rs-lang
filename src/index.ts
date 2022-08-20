import "./style/header.scss";
import "./style/footer.scss";
import "./components/controller/CRUD/CrudApi";
import router from "./components/controller/Router";
import { Registration } from "./components/registration/registrationForm";
import { Main } from "./components/main/main";


const mainText = new Main;
mainText.showMain()
mainText.ListenerLogo()
const register = new Registration;
register.ListenerBtn()

router.add(/home/, () => {
  //alert("welcome in home page");
});
// router.add(/user/, () => {
//   alert(`userId`);
// });
// router.add(/user\/nikita/, () => {
//   alert(`userId nikita`);
// });



