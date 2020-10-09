$(document).ready(function () {
    /* main sections*/
    var loginPage = $(".login-page");
    var userProfile = $(".userProfile");
    var dashBoard = $(".dashboard");
    var inputName = $("#user-name");
    var inputPassword = $("#password-input");
    var infoWindow = $(".info-window");
    var languageList = $(".select-language");
    var cardsContainer = $(".cards-container");
    var wordContainer = $("#wordContainer");
    var addGroupInput = $(".add-group-input");
    var users = getUsers();
    var lanObj;
    var currentUser;
    var currentLanguage;
    var currentGroup;

    /* to speed up debugging  */
    inputName.val('bernat');
    inputPassword.val('12345AAA')

    /* fadein effect*/
    loginPage.removeClass('invisible');
    $(document).click(function (event) {
        if (event.target.id == "login-btn") login();
        else if (event.target.id == "register-btn") register();
        else if ($(event.target).hasClass('btn-add-language')) newLanguage();
        else if ($(event.target).hasClass('profile-languages') && !$(event.target).hasClass('modal-trigger')) {
            goToDashboard(event.target);
            populateDashboard(event.target)
            var language = event.target.dataset.language;
            console.log('data-language', language);
            currentLanguage = currentUser.languages[language]; // objecto language
        } else if ($(event.target.hasClass('box'))) {
            var groupName = event.target.dataset.group;
            currentGroup = currentLanguage.groups[groupName];
             populateWords()
        }
    })

    $('.buttonBack').click(backToLogin);

    $('#addButton-group').click(createGroup)
    /* Modals */
    $(".modal-trigger").click(function (e) {
        e.preventDefault();
        dataModal = $(this).attr("data-modal");
        $("#" + dataModal).css({
            "display": "block"
        });
    });

    $(".close-modal, .modal-sandbox").click(function () {
        $(".modal").css({
            "display": "none"
        });
    });


    /* when user click on boxes */

    $(".box").click(function() {
       // cardsContainer.empty('');
        // $("#wordContained").append(populateOnWords)
        
        cardsContainer.addClass('hidden');
        wordContainer.removeClass('hidden')
    })


    /* get  languages object*/
    function login() {
        if (validateRegister("#user-name", "#password-input")) {
            var userName = inputName.val();
            var password = inputPassword.val();
            var newUser = users.getUser(userName);
            if (newUser && newUser.checkPassword(password)) {
                message('login successful!');
                currentUser = newUser;
                goToProfile();
                populateUserProfile();
            } else message('login failed, please check your username and password');
        }
    }

    function register() {
        var userName = inputName.val();
        var password = inputPassword.val();
        if (users.userExist(userName)) message('user already exists, please choose another username')
        else if (validateRegister("#user-name", "#password-input")) {

            currentUser = users.setUser(userName, password);
            users.save();
            message('register successful!');
            goToProfile();
            populateUserProfile();

        }
    }
    var ENDPOINT_FLAGS = "https://www.countryflags.io/";
    var languagesWrapper = $('.languages-wrapper');

    function populateUserProfile() {
        console.log(currentUser)
        $(".username-profile").text(currentUser.userName);
        $(".last-active").text(currentUser.lastActive);
        console.log('languages', currentUser.languages)
        var languages = currentUser.languages;
        Object.keys(languages).forEach(function (name) {
            populateLanguage(languages[name]);
        })
    }

    function populateLanguage(language) {
        var lanContainer = $('<div class="container row profile-languages" data-language=' + language['name'] + '>' + getImageFlag(language['code']) + '<span class = "language-label">' + language['name'] + '</span></div>');
        languagesWrapper.append(lanContainer);
    }

    function populateDashboard(eventTarget) {
        var language = eventTarget.dataset.language;
        console.log(currentUser);
        currentLanguage = currentUser.languages[language]; // objecto language
        populateGroups(currentLanguage.groups);
    }

    function populateGroups(groups) {
        Object.keys(groups).forEach(function (item) {
            populateOneGroup(groups[item]);
        })
    }

    function populateOneGroup(group) {
        var groupContainer = $('<div class="box col-md-3" data-group="' + group.name + '"><p>' + group.name + '</p></div>');
        cardsContainer.append(groupContainer);
    }

    function createGroup() {
        //else if ($(event.target).hasClass('.add-group-input')) createGroup();
        console.log('groupCreated');
        var groupName = addGroupInput.val();
        if (!groupName) message("the name of the group can't be blank.")
        else if (currentLanguage.groupExists(groupName)) message("the name of the group already exists.");
        else {
            var newGroup = currentLanguage.setGroup(groupName);
            populateOneGroup(newGroup);
            users.save();
        }
    }

    /*Function: populateWord */
    function populateOneWord(word) {
        $('<p class="words-meaning" data-group="" '+ word.name +'"></p><ul><li>' + word.name + '</li></ul>');
        wordsContainer.append(words)
    
    }
    function populateWords() {
        var words = currentGroup[words];
        Objcect.keys(words).forEach(function(word) {
            
        })
    } 
    
    /* API*/

    var ENDPOINT_LANGUAGE_CODES = 'https://gist.githubusercontent.com/piraveen/fafd0d984b2236e809d03a0e306c8a4d/raw/4258894f85de7752b78537a4aa66e027090c27ad/'
    optionLanguages();

    function optionLanguages() {
        return axios.get(ENDPOINT_LANGUAGE_CODES).then(function (data) {
            lanObj = data.data;
            Object.keys(lanObj).forEach(function (code) {
                var lanOption = $('<option value = "' + code + '">' + lanObj[code]['name'] + '</option>')
                languageList.append(lanOption);
            })
        })
    }

    function newLanguage() {
        var language = $(".select-language :selected");

        console.log(language);
        var newLanguage = currentUser.addLanguage(language.text(), language.val());
        console.log(newLanguage);
        users.save();
        populateLanguage(newLanguage);
    }

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
        return '<span class = "iconify" data - icon = "fxemoji:' + code + 'flag data -inline = "false"> </span>'
        //'<img class = "flag" src =' + ENDPOINT_FLAGS + code + '/shiny/64.png> ';
    }

    /* navigate */

    function showProfile() {
        userProfile.removeClass('hidden');
        setTimeout(function () {
            userProfile.removeClass('invisible')
        }, 500)
    }

    function showLogin() {
        loginPage.removeClass('hidden');
        setTimeout(function () {
            loginPage.removeClass('invisible')
        }, 500)

    }

    function showDashBoard() {
        dashBoard.removeClass('hidden');
        setTimeout(function () {
            dashBoard.removeClass('invisible')
        }, 500)

    }

    function hideProfile() {
        userProfile.addClass('hidden');
        userProfile.addClass('invisible');

    }

    function hideLogin() {
        loginPage.addClass('hidden');
        loginPage.addClass('invisible');
    }

    function hideDashBoard() {
        dashBoard.addClass('invisible');
        dashBoard.addClass('hidden');
    }

    function backToLogin() {
        hideProfile();
        showLogin();
    }

    function goToProfile() {
        inputName.val("");
        inputPassword.val("");
        hideLogin();
        showProfile();
    }

    function goToDashboard(eventTarget) {
        hideProfile();
        showDashBoard();
    }

});