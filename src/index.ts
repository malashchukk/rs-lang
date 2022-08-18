import "./style.scss";
import "./controller/CRUD/CrudApi";
import router from "./components/controller/Router";

router.add(/home/, () => {
  alert("welcome in home page");
});
router.add(/user/, () => {
  alert(`userId`);
});
router.add(/user\/nikita/, () => {
  alert(`userId nikita`);
});

