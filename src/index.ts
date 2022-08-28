import "./style/style.scss"
import "./components/controller/CRUD/CrudApi";
import router from "./components/controller/Router";
import { Main } from "./components/main/main";

const mainText = new Main;
mainText.showMain()
mainText.ListenerBtn()

router.add(/home/, () => {
  //alert("welcome in home page");
});
// router.add(/user/, () => {
//   alert(`userId`);
// });
// router.add(/user\/nikita/, () => {
//   alert(`userId nikita`);
// });



