import crudApi from "../../controller/CRUD/CrudApi";

class User {
  // private subscribers: Array<T> = [];
  currUser = {
    Message: "Unauthenticated",
    token: "",
    refreshToken: "",
    userId: "",
    name: "",
  };
  isAuthorization() {
    if (localStorage["user"]) {
      // console.log(this.currUser);
      this.currUser = JSON.parse(localStorage["user"]);

      this.updateToken(this.currUser.userId);
      return true;
    } else {
      return false;
    }
  }
  signIn(options: { email: string; password: string }) {
    crudApi
      .createItem(
        {
          endpoint: "/signin",
        },
        {
          email: `${options.email}`,
          password: `${options.password}`,
        }
      )
      .then((a) => {
        localStorage["user"] = JSON.stringify(a);
        // console.log(a);
      });
  }
  signUp(options: { name: string; email: string; password: string }) {
    crudApi
      .createItem(
        {
          endpoint: "/users",
        },
        {
          name: `${options.email}`,
          email: `${options.email}`,
          password: `${options.password}`,
        }
      )
      .then((a) => {
        this.signIn({
          email: `${options.email}`,
          password: `${options.password}`,
        });
        console.log(a);
        // eslint-disable-next-line prettier/prettier
    });
  }
  private updateToken(userId: string) {
    crudApi
      .getItem(
        {
          endpoint: `/users/${userId}/tokens`,
        },
        `${this.currUser.refreshToken}`
      )
      .then((a) => {
        console.log(a);
      });
  }
}
const user = new User();
export default user;

// this.signIn({ email: "black@will.com", password: "qwerty123" });
