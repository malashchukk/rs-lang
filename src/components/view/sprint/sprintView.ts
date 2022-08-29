import router from "../../controller/Router";

class SprintView {
  renderStart() {
    alert("There will be sprint");
  }
}
const sprintView = new SprintView();
router.add("sprint", () => {
  sprintView.renderStart();
});

export default sprintView;
