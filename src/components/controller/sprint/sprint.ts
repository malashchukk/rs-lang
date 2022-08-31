class Sprint {
  score!: number;
  tries!: number;
  getWords() {
    const selectLevel = document.querySelector(
      ".inform-level__select"
    ) as HTMLSelectElement;
    console.log(selectLevel.value);
  }
  // words!:
  // start game
  // get words
  // count score
  // final result
  // timers
  // tries
}
const sprint = new Sprint();
export default sprint;
