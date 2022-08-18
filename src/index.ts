import "./style.scss";
import router from "./components/controller/Router";

router.add("home", () => {
  alert("welcome in home page");
});
// router.add("user", () => {
//   alert(`userId`);
// });
// router.add("user/nikita", () => {
//   alert(`userId nikita`);
// });
// router.remove("user");
