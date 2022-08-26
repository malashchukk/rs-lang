import user from "../../controller/authorization/authorization";

class PopUp {
  private openPopUpButton = document.createElement("a");
  private popUp = document.createElement("div");
  private popUpBackground = document.createElement("div");
  private logout = document.createElement("a");
  private renderPopUpHtml() {
    const popUpHTML = document.createElement("div");
    popUpHTML.classList.add("popup-wrapper");
    popUpHTML.append(this.createPopUpBackground());
    popUpHTML.append(this.createPopUp());
    return popUpHTML;
  }
  private createForm() {
    const form = document.createElement("form");
    const inputs = document.createElement("div");
    inputs.classList.add("inputs");
    inputs.innerHTML = `
    <input type="text" name="name" class="name" placeholder="Имя" maxlength="64" autocomplete="off">
    <input type="text" name="email" class="email" placeholder="Почта" maxlength="64" required="" autocomplete="off">
    <input type="password" name="password" minlength="8" required="" class="password" maxlength="64" placeholder="Пароль">
    <div class="show-password">
      <p class="show-password__text">Показать пароль</p>
      <input type="checkbox" class="show-password__checkbox">
    </div>
    `;
    const nameField = inputs.querySelector(".name") as HTMLInputElement;
    const emailField = inputs.querySelector(".email") as HTMLInputElement;
    const passwordField = inputs.querySelector(".password") as HTMLInputElement;
    const showPassword = inputs.querySelector(
      ".show-password__checkbox"
    ) as HTMLInputElement;
    showPassword.onclick = () => {
      if (passwordField.type === "password") {
        passwordField.type = "text";
      } else {
        passwordField.type = "password";
      }
    };
    //
    const buttons = document.createElement("div") as HTMLDivElement;
    buttons.classList.add("buttons_login");
    buttons.innerHTML = `
      <button class="button_isSignUp" type="button">
        Есть аккаунт?
      </button>
      <button class="authorization-buttons button_login hidden" type="button">
        Войти
      </button>
      <button class="button_signUp authorization-buttons" type="button">
        Регистрация
      </button>
    `;
    const logInButton = buttons.querySelector(
      ".button_login"
    ) as HTMLButtonElement;
    logInButton.addEventListener("click", () => {
      this.removeError();
      // get idea from https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
      const emailPattern = /\S+@\S+\.\S+/;
      if (!emailPattern.test(emailField.value)) {
        this.showError("Некорректная почта");
      } else if (passwordField.value.length < 8) {
        this.showError("Некорректный пароль");
      } else {
        user.logIn({ email: emailField.value, password: passwordField.value });
        this.close();
      }
    });
    const isSignUp = buttons.querySelector(
      ".button_isSignUp"
    ) as HTMLButtonElement;
    isSignUp.addEventListener("click", () => {
      this.removeError();
      nameField.classList.add("hidden");
      isSignUp.classList.add("hidden");
      signUpButton.classList.add("hidden");
      logInButton.classList.remove("hidden");
    });
    const signUpButton = buttons.querySelector(
      ".button_signUp"
    ) as HTMLButtonElement;
    signUpButton.addEventListener("click", () => {
      this.removeError();
      // get idea from https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
      const emailPattern = /\S+@\S+\.\S+/;
      if (nameField.value.length < 1) {
        this.showError("Некорректное имя");
      } else if (!emailPattern.test(emailField.value)) {
        this.showError("Некорректная почта");
      } else if (passwordField.value.length < 8) {
        this.showError("Некорректный пароль");
      } else {
        user.signUp({
          name: nameField.value,
          email: emailField.value,
          password: passwordField.value,
        });
        logInButton.classList.add("hidden");
        signUpButton.classList.remove("hidden");
        this.close();
      }
    });
    form.append(inputs, buttons);
    return form;
  }
  private createPopUp() {
    const popUp = this.popUp;
    popUp.classList.add("popup");
    const popUpCloseButton = document.createElement("a");
    popUpCloseButton.innerHTML = "&times";
    popUpCloseButton.classList.add("popup__close");
    popUpCloseButton.addEventListener("click", () => this.close());
    popUp.innerHTML = `
      <h1 class="logo-title">Авторизация</h1>
      <div class="error-message hidden-error"></div>
    `;
    popUp.append(popUpCloseButton);
    popUp.append(this.createForm());
    return popUp;
  }
  private createPopUpBackground() {
    const popUpBackground = this.popUpBackground;
    popUpBackground.addEventListener("click", () => this.close());
    return popUpBackground;
  }
  private showError(message: string) {
    const errorHtml = document.querySelector(
      ".error-message"
    ) as HTMLDivElement;
    errorHtml.classList.remove("hidden-error");
    errorHtml.innerHTML = message;
  }
  private removeError() {
    const errorHtml = document.querySelector(
      ".error-message"
    ) as HTMLDivElement;
    errorHtml.classList.add("hidden-error");
  }
  replacePopUpButton(type?: string) {
    const signIn = document.querySelector(
      ".btn-registration"
    ) as HTMLButtonElement;
    const openPopUpButton = this.openPopUpButton;
    const logoutButton = this.logout;
    switch (type) {
      case "authorized":
        logoutButton.classList.add("logout-button");
        logoutButton.classList.add("btn-registration");
        logoutButton.innerHTML = "Выйти";
        openPopUpButton.classList.add("btn-registration");
        openPopUpButton.innerText = JSON.parse(localStorage["user"]).name;
        openPopUpButton.addEventListener("click", () => {
          document.body.style.overflow = "auto";
          this.popUp.classList.remove("active");
          this.popUpBackground.classList.remove("popup__background");
        });
        logoutButton.addEventListener("click", () => {
          this.replacePopUpButton("unauthorized");
          localStorage.clear();
          logoutButton.remove();
        });
        signIn.replaceWith(openPopUpButton, logoutButton);
        break;
      case "unauthorized":
        document.body.append(this.renderPopUpHtml());
        openPopUpButton.classList.add("btn-registration");
        openPopUpButton.innerHTML = "Регистрация";
        openPopUpButton.addEventListener("click", () => {
          this.open();
        });
        signIn.replaceWith(openPopUpButton);
        break;
      default:
        break;
    }
  }
  open() {
    document.body.style.overflow = "hidden";
    this.popUp.classList.add("active");
    this.popUpBackground.classList.add("popup__background");
  }
  close() {
    this.removeError();
    const hiddenElements = document.querySelectorAll(".hidden");
    const loginButton = document.querySelector(".button_login");
    this.popUp.classList.remove("active");
    this.popUpBackground.classList.toggle("popup__background");
    document.body.style.overflow = "auto";
    setTimeout(() => {
      loginButton?.classList.toggle("hidden");
      hiddenElements.forEach((element) => element.classList.toggle("hidden"));
    }, 700);
  }
  update(option: boolean) {
    if (option) {
      this.replacePopUpButton("authorized");
    } else {
      this.replacePopUpButton("unauthorized");
    }
  }
}
const popUp = new PopUp();
user.subscribe(popUp);
export default popUp;
