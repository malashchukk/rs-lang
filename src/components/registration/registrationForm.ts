import "./form.scss"

export class Registration{
    static instance: Registration;     

    constructor() {
        if (typeof Registration.instance === 'object') {
            return Registration.instance;
        }   
        Registration.instance = this;
        return Registration.instance;
    }   

    showForm(): void{
        const main = document.querySelector('.main') as HTMLElement;
        main.innerHTML = `
        <div class="wrapper_login_page">
          <section class="login-page">
            <h1 class="logo-title">Войти в систему</h1>
            <div class="error-message"></div>        
            <form action="POST" class="login_form">
                <div class="inputs">
                <input type="text" name="email" id="email" class="email" placeholder="Почта" maxlength="50" autocomplete="off">
                <input type="password" name="password" id="password" class="password" placeholder="Пароль">              
                </div>
                <div class="buttons_login">
                <button class="button_signIn">Войти</button>
                <button class="button_login button_signUp">Регистрация</button>
                </div>
            </form>
          </section> 
        </div>
        `
    }
}


 
    

    