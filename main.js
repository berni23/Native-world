$(document).ready(function () {


    var loginPage = $(".login-page");

    loginPage.removeClass('invisible');
    var loginBtn = $("#login-btn");
    var registerBtn = $("#register-btn");
    var inputName = $("#user-name");
    var inputPassword = $("#password-input");
    var infoWindow = $(".info-window");
    var users = getUsers();

    loginBtn.click(login);
    registerBtn.click(register);

    function login() {
        var userName = inputName.val();
        var password = inputPassword.val();
        var user = users[userName];

        if (user && user.password == password) {

            // login successful

            message('login successful!')
            // 1- hide login, show profile

            //
        } else {

            // message login failed, try again or register

        }
    }

    function register() {

        var userName = inputName.val();
        var password = inputPassword.val();
        if (users.userExist(userName)) {

            message('user already exists')
            // user already exists
        } else if (validateRegister("#user-name", "#password-input")) {

            users.setUser(userName, password);

            console.log(users);
            users.save();
        }
    }

<<<<<<< HEAD

    /* UTILS*/

    function validateRegister(inputName, inputPassword) {
        clearErrors();
        var nameRgx = /\b.{3,}\b/
        var errName = "username should contain more than three characters";
        var passwordRgx = /(?=.*\d)(?=.*[A-Z]).{6,}/;
        var errPassword = "password must contain an uppercase, a number, and 6 characters minimum"
        return validate(inputName, nameRgx, errName) * validate(inputPassword, passwordRgx, errPassword)


    }

    function message(msg) {
        infoWindow.text(msg);
        infoWindow.addClass("show-info");
        setTimeout(() => infoWindow.removeClass("show-info"), 1500);
    }

    function validate(input, condition, errorMsg) {
        let validation = true;
        if (!condition.test($(input).val())) {
            $(input).after("<div class='error-msg col-lg-12 col-md-8'><p>" + errorMsg + "</p></div>");
            $(input).addClass("error-input")
            validation = false;
        }
        return validation; // true if validation passed, else false
    }

    // clear form errors
    function clearErrors() {
        var errorMsg = $(".error-msg");
        var errorInput = $(".error-input");
        for (div of errorMsg) div.remove();
        for (div of errorInput) div.classList.remove("error-input");
    }
});
=======
/* ===============js for index2.html ???? ===============*/
>>>>>>> suki
