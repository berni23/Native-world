$(document).ready(function () {
    var loginPage = $(".login-page");
    var userProfile = $(".userProfile");
    loginPage.removeClass('invisible');
    var loginBtn = $("#login-btn");
    var registerBtn = $("#register-btn");
    var inputName = $("#user-name");
    var inputPassword = $("#password-input");
    var infoWindow = $(".info-window");
    var users = getUsers();
    var currentUser;
    loginBtn.click(login);
    registerBtn.click(register);





    function login() {

        if (validateRegister("#user-name", "#password-input")) {
            var userName = inputName.val();
            var password = inputPassword.val();
            var newUser = users.getUser(userName);
            if (newUser && newUser.checkPassword(password)) {
                message('login successful!');
                loginPage.addClass('hidden');
                // populate user profile
                userProfile.removeClass('hidden');
            } else {
                message('login failed, please check your username and password');
                console.log('login failed');
                // message login failed, try again or register
            }
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
            currentUser = users.getUser(userName);
            users.save();
            message('register successful!');
            loginPage.addClass('hidden');

            // populate user profile
            userProfile.removeClass('hidden');
        }
    }


    /* API*/

    var ENDPOINT_LANGUAGE_CODES = ' https://gist.githubusercontent.com/piraveen/fafd0d984b2236e809d03a0e306c8a4d/raw/4258894f85de7752b78537a4aa66e027090c27ad/'

    function optionLanguages() {

        axios.get(ENDPOINT_LANGUAGE_CODES).then(function (data) {
            console.log(data.data)
        })
    }

    optionLanguages();

    /* UTILS*/

    function validateRegister(inputName, inputPassword) {
        clearErrors();
        var nameRgx = /\b.{3,}\b/
        var errName = "username should contain more than three characters";
        var passwordRgx = /(?=.*\d)(?=.*[A-Z]).{6,}/;
        var errPassword = "password must contain an uppercase, a number, and 6 characters minimum"
        return validate(inputName, nameRgx, errName) && validate(inputPassword, passwordRgx, errPassword);
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

/* ===============js for index2.html ???? ===============*/