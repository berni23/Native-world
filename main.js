$(document).ready(function () {
    var loginPage = $(".login-page");
    var userProfile = $(".userProfile");
    loginPage.removeClass('invisible');
    var inputName = $("#user-name");
    var inputPassword = $("#password-input");
    var infoWindow = $(".info-window");
    var users = getUsers();
    var lanObj;
    var currentUser;
    $(document).click(function (event) {
        if (event.target.id == "login-btn") login();
        else if (event.target.id == "register-btn") register();
        else if ($(event.target).hasClass('new-language')) NewLanguage();
    })


    /* get  languages object*/
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
            } else message('login failed, please check your username and password');
        }
    }

    function register() {
        var userName = inputName.val();
        var password = inputPassword.val();
        if (users.userExist(userName)) message('user already exists, please choose another username')
        else if (validateRegister("#user-name", "#password-input")) {
            users.setUser(userName, password);
            currentUser = users.getUser(userName);
            users.save();
            message('register successful!');
            loginPage.addClass('hidden');
            populateUserProfile();
            userProfile.removeClass('hidden');
        }
    }


    var ENDPOINT_FLAGS = "https://www.countryflags.io/";
    var languagesWrapper = $('.languages-wrapper')

    function populateUserProfile() {
        $(".username-profile").text(currentUser.userName);
        $(".lastActive-profile").text(currentUser.lastActive);

        Object.keys(currentUser.languages).forEach(function (language) {
            var lanContainer = $('<div class="container row profile-languages">' + getImageFlag(language['code']) + '<span class = "language-label">' + language['name'] + '</span></div>');
            languagesWrapper.append(lanContainer);
        })
    }


    /* API*/

    var ENDPOINT_LANGUAGE_CODES = 'https://gist.githubusercontent.com/piraveen/fafd0d984b2236e809d03a0e306c8a4d/raw/4258894f85de7752b78537a4aa66e027090c27ad/'

    function optionLanguages() {
        axios.get(ENDPOINT_LANGUAGE_CODES).then(function (data) {
            lanObj = data.data;
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

    function getImageFlag(code) {
        return '<img class = "flag"src = ' + ENDPOINT_FLAGS + code + '/shiny/64.png> ';
    }
});



/* ===============js for index2.html ???? ===============*/