import crudApi from "../../controller/CRUD/CrudApi";
export interface Ilistener {
  update(): void;
}

class User {
  private subscribers: Array<Ilistener> = [];
  currUser = {
    Message: "Unauthenticated",
    token: "",
    refreshToken: "",
    userId: "",
    name: "",
  };
  constructor() {
    if (localStorage["user"]) {
      this.currUser = JSON.parse(localStorage["user"]);
    }
  }
  isAuthorization() {
    if (localStorage["user"]) {
      console.log(this.currUser);
      this.updateToken();
      // this.notify();
      return true;
    } else {
      return false;
    }
  }
  logIn(options: { email: string; password: string }) {
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
        console.log(a);
        this.notify();
        // this.updateToken();
        // return a;
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
      .then(() => {
        this.logIn({
          email: `${options.email}`,
          password: `${options.password}`,
        });
      });
  }
  updateToken() {
    crudApi
      .getItem(
        {
          endpoint: `/users/${this.currUser.userId}/tokens`,
        },
        `${this.currUser.refreshToken}`
      )
      .then((data) => {
        console.log(data);
        // localStorage["user"].token = data;
      });
  }
  //{"message":"Authenticated","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMDNkMzhkNjM2YjVlMDAxNmM1NGJiZiIsImlhdCI6MTY2MTE5NzczMiwiZXhwIjoxNjYxMjEyMTMyfQ.NhGxwstU7iI0MyKUeCbJPau2NsrcW0XsC7mRBeCAGNg","refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMDNkMzhkNjM2YjVlMDAxNmM1NGJiZiIsInRva2VuSWQiOiIxYWJmNjgxYS05MjczLTRlYzQtODJlMy1mYzZkOTUzZmM0MGYiLCJpYXQiOjE2NjExOTc3MzIsImV4cCI6MTY2MTIxMzkzMn0.hPz_NN0ZpvHUuC8EuQf-bLksccaXsF4AI33ECOrRsjo","userId":"6303d38d636b5e0016c54bbf","name":"roma@roma.com"}
  subscribe(listener: Ilistener) {
    if (!this.subscribers.includes(listener)) {
      this.subscribers.push(listener);
    }
  }
  unsubscribe(listener: Ilistener) {
    const index = this.subscribers.indexOf(listener);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }
  notify() {
    for (const i of this.subscribers) {
      i.update();
    }
  }
}
const user = new User();

export default user;

// this.signIn({ email: "black@will.com", password: "qwerty123" });
