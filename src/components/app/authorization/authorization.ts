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
      this.notify();
      return true;
    } else {
      return false;
    }
  }
  async logIn(options: { email: string; password: string }) {
    const data = await crudApi.createItem(
      {
        endpoint: "/signin",
      },
      {
        email: `${options.email}`,
        password: `${options.password}`,
      }
    );
    localStorage["user"] = JSON.stringify(data);
    if (data) {
      this.notify();
    } else {
      alert("Аккаунт не найдено, попробуйте зарегистрироваться");
    }
  }
  async signUp(options: { name: string; email: string; password: string }) {
    const data = await crudApi.createItem(
      {
        endpoint: "/users",
      },
      {
        name: `${options.name}`,
        email: `${options.email}`,
        password: `${options.password}`,
      }
    );
    if (data) {
      this.logIn({
        email: `${options.email}`,
        password: `${options.password}`,
      });
    } else {
      alert("Вы уже зарегистрированы");
    }
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
    for (let i = 0; i < this.subscribers.length; i += 1) {
      this.subscribers[i]?.update();
    }
  }
}
const user = new User();

export default user;

// this.signIn({ email: "black@will.com", password: "qwerty123" });
