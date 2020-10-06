$(document).ready(function () {

    var loginBtn = $("#login-btn");
    var registerBtn = $("#register-btn");
    var inputName = $("#user-name");
    var inputPassword = $("#password-input");


    var users = getUsers();

    loginBtn.click(login);
    registerBtn.click(register);

    function login() {
        var userName = inputName.val();
        var password = inputPassword.val();

        var user = users[userName];

        console.log(users);

        if (user && user.password == password) {

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

        if (users.userExist(userName)) {

            // user already exists
        } else {


            users.setUser(userName, password);


            console.log(users);

            console.log('registered');
        }

    }




});