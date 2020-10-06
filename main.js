$(document).ready(function () {

    var loginBtn = $("#login-btn");
    var registerBtn = $("#register-btn");
    var inputName = $("#user-name");
    var inputPassword = $("#password-input");

    loginBtn.click(login);
    registerBtn.click(register);

    function login() {
        var userName = inputName.val();
        var password = inputPassword.val();
        var user = getUser(userName);

        if (user && user.password === password) {

            // login successful

            //message login successful

            // 1- hide login, show profile

            //
        } else {

            console.log('loged In');
            // message login failed, try again or register

        }

    }

    function register() {

        console.log('hi');
        var userName = inputName.val();
        var password = inputPassword.val();

        if (getUser()) {

            // user already exists
        } else {

            createUser(userName, password)

            console.log('registered');
        }

    }




});