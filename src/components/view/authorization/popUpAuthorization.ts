import user from "../../app/authorization/authorization";

class PopUp {
  private openPopUpButton = document.createElement("a");
  private popUp = document.createElement("div");
  private popUpBackground = document.createElement("div");
  renderPopUpHtml() {
    const popUpHTML = document.createElement("div");
    popUpHTML.classList.add("popup-wrapper");
    popUpHTML.append(this.createPopUpBackground());
    popUpHTML.append(this.createPopUp());
    return popUpHTML;
  }
  createForm() {
    const form = document.createElement("form");
    //
    const inputs = document.createElement("div");
    inputs.classList.add("inputs");
    const nameField = document.createElement("input") as HTMLInputElement;
    nameField.type = "text";
    nameField.name = "name";
    nameField.classList.add("name");
    nameField.placeholder = "Имя";
    nameField.maxLength = 50;
    nameField.autocomplete = "off";
    const emailField = document.createElement("input") as HTMLInputElement;
    emailField.type = "text";
    emailField.name = "email";
    emailField.classList.add("email");
    emailField.placeholder = "Почта";
    emailField.maxLength = 50;
    emailField.required = true;
    emailField.autocomplete = "off";
    const passwordField = document.createElement("input") as HTMLInputElement;
    passwordField.type = "password";
    passwordField.name = "password";
    passwordField.minLength = 8;
    passwordField.required = true;
    passwordField.classList.add("password");
    passwordField.placeholder = "Пароль";
    //
    const buttons = document.createElement("div") as HTMLDivElement;
    buttons.classList.add("buttons_login");
    const logInButton = document.createElement("button") as HTMLButtonElement;
    logInButton.classList.add("button_login", "button_logIn", "hidden");
    logInButton.innerHTML = "Войти";
    logInButton.type = "button";
    logInButton.addEventListener("click", () => {
      const emailPattern = /\S+@\S+\.\S+/;
      if (!emailPattern.test(emailField.value)) {
        alert("Некорректная почта");
      } else if (passwordField.value.length < 8) {
        alert("Некорректный пароль");
      } else {
        user.logIn({ email: emailField.value, password: passwordField.value });
        this.closePopUp();
      }
    });
    const isLogInButton = document.createElement("button") as HTMLButtonElement;
    isLogInButton.classList.add("button_signIn");
    isLogInButton.innerHTML = "Есть аккаунт?";
    isLogInButton.type = "button";
    isLogInButton.addEventListener("click", () => {
      nameField.classList.add("hidden");
      isLogInButton.classList.add("hidden");
      signUpButton.classList.add("hidden");
      logInButton.classList.remove("hidden");
    });
    const signUpButton = document.createElement("button") as HTMLButtonElement;
    signUpButton.classList.add("button_signUp", "button_login");
    signUpButton.innerHTML = "Регистрация";
    signUpButton.type = "button";
    signUpButton.addEventListener("click", () => {
      const emailPattern = /\S+@\S+\.\S+/;
      if (nameField.value.length < 1) {
        alert("Некорректное имя");
      } else if (!emailPattern.test(emailField.value)) {
        alert("Некорректная почта");
      } else if (passwordField.value.length < 8) {
        alert("Некорректный пароль");
      } else {
        user.signUp({
          name: nameField.value,
          email: emailField.value,
          password: passwordField.value,
        });
        logInButton.classList.add("hidden");
        signUpButton.classList.remove("hidden");
        this.closePopUp();
      }
    });
    //
    inputs.append(nameField, emailField, passwordField);
    buttons.append(isLogInButton, logInButton, signUpButton);
    form.append(inputs, buttons);
    return form;
  }
  createPopUp() {
    const popUp = this.popUp;
    popUp.classList.add("popup");
    const popUpCloseButton = document.createElement("a");
    popUpCloseButton.innerHTML = "&times";
    popUpCloseButton.classList.add("popup__close");
    popUpCloseButton.addEventListener("click", () => this.closePopUp());
    popUp.innerHTML = `
    <h1 class="logo-title">Регистрация</h1>
    <div class="error-message"></div>
    `;
    popUp.append(popUpCloseButton);
    popUp.append(this.createForm());
    return popUp;
  }
  createPopUpBackground() {
    const popUpBackground = this.popUpBackground;
    popUpBackground.addEventListener("click", () => this.closePopUp());
    return popUpBackground;
  }
  replacePopUpButton(type?: string) {
    const openPopUpButton = this.openPopUpButton;
    switch (type) {
      case "authorized":
        openPopUpButton.classList.add("btn-registration");
        openPopUpButton.innerHTML = JSON.parse(localStorage["user"]).name;
        openPopUpButton.href = "/#/account";
        openPopUpButton.addEventListener("click", () => {
          document.body.style.overflow = "auto";
          this.popUp.classList.remove("active");
          this.popUpBackground.classList.remove("popup__background");
        });
        break;
      case "unauthorized":
        document.body.append(this.renderPopUpHtml());
        openPopUpButton.classList.add("btn-registration");
        openPopUpButton.innerHTML = "Регистрация";
        openPopUpButton.addEventListener("click", () => {
          document.body.style.overflow = "hidden";
          this.popUp.classList.add("active");
          this.popUpBackground.classList.add("popup__background");
        });
        break;
      default:
        break;
    }
    const signIn = document.querySelector(".btn-registration");
    signIn?.replaceWith(openPopUpButton);
  }
  closePopUp() {
    const hiddenElements = document.querySelectorAll(".hidden");
    const loginButton = document.querySelector(".button_logIn");
    this.popUp.classList.remove("active");
    this.popUpBackground.classList.toggle("popup__background");
    document.body.style.overflow = "auto";
    setTimeout(() => {
      loginButton?.classList.toggle("hidden");
      hiddenElements.forEach((element) => element.classList.toggle("hidden"));
    }, 700);
  }
  update() {
    this.replacePopUpButton("authorized");
  }
}
const popUp = new PopUp();
user.subscribe(popUp);
export default popUp;
