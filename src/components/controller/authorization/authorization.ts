import crudApi from "../CRUD/CrudApi";
import { ISubscriber } from "./ISubscriber";

class User {
  private subscribers: Array<ISubscriber> = [];
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
      this.currUser = JSON.parse(localStorage["user"]);
      this.testToken();
      this.notify(true);
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
      this.isAuthorization();
    } else {
      alert(
        "Пароль не верный или аккаунт не найдено, попробуйте зарегистрироваться"
      );
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
  async updateToken() {
    const data: { token: string; refreshToken: string } = await crudApi.getItem(
      {
        endpoint: `/users/${this.currUser.userId}/tokens`,
      },
      this.currUser.refreshToken
    );
    localStorage["user"].token = data.token;
    localStorage["user"].refreshToken = data.refreshToken;
  }
  async testToken() {
    const data = await crudApi.getItem(
      {
        endpoint: `/users/${this.currUser.userId}`,
      },
      this.currUser.token
    );
    if (!data) {
      this.updateToken();
    }
  }
  subscribe(listener: ISubscriber) {
    if (!this.subscribers.includes(listener)) {
      this.subscribers.push(listener);
    }
  }
  unsubscribe(listener: ISubscriber) {
    const index = this.subscribers.indexOf(listener);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }
  notify(option: boolean) {
    for (let i = 0; i < this.subscribers.length; i += 1) {
      this.subscribers[i]?.update(option);
    }
  }
}
const user = new User();
export default user;

// this.signIn({ email: "black@will.com", password: "qwerty123" });
