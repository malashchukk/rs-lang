import "./style.scss";
import Router from "./components/controller/Router";

const router = new Router({
  mode: "hash",
  root: "/",
});

// example of routing work
router
  .add(/home/, () => {
    alert("welcome in home page");
  })
  .add(/users\/(.*)/, (id: number) => {
    alert(`userId: ${id}`);
  });
