import "./style/style.scss";
import "./components/controller/CRUD/CrudApi";
import "./components/controller/Router";
import "./components/view/renderTextbook";
import "./components/view/pagination";
import { Main } from "./components/view/main/main";
import { About } from "./components/view/aboutPage/aboutPage";
import user from "./components/controller/authorization/authorization";
import popUp from "./components/view/popUpAuthorization/popUpAuthorization";
const aboutTeam = new About();
aboutTeam.ListenerBtnAbout();
const mainText = new Main();
popUp.replacePopUpButton("unauthorized");
mainText.showMain();
mainText.ListenerLogo();
user.isAuthorization();

// import crudApi from "./components/controller/CRUD/CrudApi";

// crudApi
//   .getItem(
//     {
//       endpoint: `/users/${
//         JSON.parse(localStorage["user"]).userId
//       }/aggregatedWords`,
//       options: {
//         wordsPerPage: "22",
//         // "userWord.optional": "";
//         filter: JSON.stringify({
//           $and: [
//             {
//               "userWord.difficulty": "hard",
//             },
//           ],
//         }) 
//       },
//     },
//     JSON.parse(localStorage["user"]).token
//   )
//   .then((data) => console.log(data));
// // // crudApi
// // //   .createItem(
// // //     { endpoint: "/signin" },
// // //     {
// // //       email: "root@root.com",
// // //       password: "rootroot",
// // //     }
// // //   )
// // //   .then((data) => console.log("fefefe", data));
