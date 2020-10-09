$(document).ready(function () {

    /* main sections*/
    var loginPage = $(".login-page");
    var userProfile = $(".userProfile");
    var dashBoard = $(".dashboard");

    /* inputs*/
    var inputName = $("#user-name");
    var inputPassword = $("#password-input");
    var addGroupInput = $("#add-group-input");
    var addWordInput = $("#add-word-input");
    var addTransInput = $("#add-trans-input");

    /* user profile*/
    var lanObj;
    var languageList = $(".select-language");
    var ENDPOINT_FLAGS = "https://www.countryflags.io/";
    var languagesWrapper = $('.languages-wrapper');

    /* dashboard*/
    var cardsContainer = $(".cards-container");
    var wordContainer = $(".words-container");

    /* show messages to the user*/
    var infoWindow = $(".info-window");

    /* global vars as reference to current object */
    var users = getUsers();
    var currentUser = users.getUser('bernat');
    var currentLanguage = currentUser.languages['Arabic'];
    var currentGroup;

    /* to speed up debugging  */
    inputName.val('bernat');
    inputPassword.val('12345AAA');

    /* fadein effect*/
    loginPage.removeClass('invisible');

    /* document listener*/
    $(document).click(function (event) {
        if (event.target.id == "login-btn") login();
        else if (event.target.id == "register-btn") register();
        else if ($(event.target).hasClass('btn-add-language')) newLanguage();
        else if ($(event.target).hasClass('profile-languages') && !$(event.target).hasClass('modal-trigger')) {
            var language = event.target.dataset.language;
            currentLanguage = currentUser.languages[language]; //  global reference to current language
            goToDashboard();
            populateGroups();
        } else if ($(event.target).hasClass('box') || $(event.target).parent().hasClass('box')) {
            var groupName = $(event.target).data("group") ? $(event.target).data("group") : $(event.target).parent().data("group");
            currentGroup = currentLanguage.groups[groupName]; // global reference to current group
            goToWords();
            populateWords();
        } else if ($(event.target).hasClass('backToGroups')) backToGroups();
    })

    $('.buttonBack').click(backToLogin);
    $('#addButton-group').click(createGroup);
    $('#addButton-word').click(createWord);

    /* Modal logic */

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

    /*--------------------
    Login
    --------------------*/

    function login() {
        if (validateRegister("#user-name", "#password-input")) {
            var userName = inputName.val().trim();
            var password = inputPassword.val().trim();
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
        var userName = inputName.val().trim();
        var password = inputPassword.val().trim();
        if (users.userExist(userName)) message('user already exists, please choose another username')
        else if (validateRegister("#user-name", "#password-input")) {
            currentUser = users.setUser(userName, password);
            users.save();
            message('register successful!');
            goToProfile();
            populateUserProfile();
        }
    }

    /*----------------------------
    User profile
    ----------------------------*/

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

    function newLanguage() {
        var language = $(".select-language :selected");
        console.log(language);
        var newLanguage = currentUser.addLanguage(language.text(), language.val());
        console.log(newLanguage);
        users.save();
        populateLanguage(newLanguage);
    }

    /* API choose language*/

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

    /*--------------------
    Groups of words
   ---------------------- */

    function populateGroups() {
        var keys = Object.keys(currentLanguage.groups);
        if (!keys.length) emptyGroup();
        keys.forEach(function (item) {
            populateOneGroup(currentLanguage.groups[item]);
        })
    }

    function emptyGroup() {
        var emptyMessage = $('<div class="empty-message"> <p> Click the plus button to create your first group of words </p> <span class = "iconify empty-icon" data-icon = "fa-solid:box-open"data - inline = "false"> </span> </div>');
        cardsContainer.append(emptyMessage);
    }

    function populateOneGroup(group) {
        var groupContainer = $('<div class="box" data-group="' + group.name + '"><p>' + group.name + '</p></div>');
        cardsContainer.append(groupContainer);
    }

    function createGroup() {
        var groupName = addGroupInput.val().trim();
        if (!groupName) message("the name of the group can't be blank.")
        else if (currentLanguage.groupExists(groupName)) message("group already exists.");
        else {
            var newGroup = currentLanguage.setGroup(groupName);
            populateOneGroup(newGroup);
            users.save();
        }
    }

    /*--------------------
    words
   ---------------------- */

    function populateOneWord(word) {
        $('<p class="words-meaning" data-group="" ' + word.name + '"></p><ul><li>' + word.name + '</li></ul>');
        wordContainer.append(word);
    }

    function populateWords() {
        var words = currentGroup.wordsList;
        Object.keys(words).forEach(function (word) {
            populateOneWord(word);
        })
    }

    function createWord() {
        var word = addWordInput.val();
        var trans = addTransInput.val();
        if (word == "" || trans == "") message("Please provide a word and a translation");
        else if (currentGroup.wordExists(word)) message(word + "  already introduced");
        else {
            var wordAdded = currentGroup.addWord(word, trans);
            users.save();
            message("word successfully added");

            console.log('added word ', wordAdded);
            populateOneWord(wordAdded);

        }
        addWordInput.val("");
        addTransInput.val("");
    }

    /* ---------------------
    UTILS
    ----------------------*/


    /* validation */
    function validate(input, condition, errorMsg) {
        let validation = true;
        if (!condition.test($(input).val())) {
            $(input).after("<div class='error-msg col-lg-12 col-md-8'><p>" + errorMsg + "</p></div>");
            $(input).addClass("error-input")
            validation = false;
        }
        return validation; // true if validation passed, else false
    }

    function validateRegister(inputName, inputPassword) {
        clearErrors();
        var nameRgx = /\b.{3,}\b/
        var errName = "username should contain more than three characters";
        var passwordRgx = /(?=.*\d)(?=.*[A-Z]).{6,}/;
        var errPassword = "password must contain an uppercase, a number, and 6 characters minimum"
        return validate(inputName, nameRgx, errName) && validate(inputPassword, passwordRgx, errPassword);
    }

    // clear form errors
    function clearErrors() {
        var errorMsg = $(".error-msg");
        var errorInput = $(".error-input");
        for (div of errorMsg) div.remove();
        for (div of errorInput) div.classList.remove("error-input");
    }

    // display a message
    function message(msg) {
        infoWindow.text(msg);
        infoWindow.addClass("show-info");
        setTimeout(() => infoWindow.removeClass("show-info"), 1500);
    }

    function getImageFlag(code) {
        return '<span class = "iconify" data-icon = "fxemoji:' + code + 'flag data-inline = "false"> </span>'
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

    function goToDashboard() {
        hideProfile();
        showDashBoard();
    }

    function goToWords() {
        cardsContainer.addClass('hidden');
        wordContainer.removeClass('hidden');
        $('.group-options').addClass('hidden');
        $('.dashboard-title').text(currentGroup.name);
        $('.word-options').removeClass('hidden');
    }

    function backToGroups() {
        wordContainer.empty();
        wordContainer.addClass('hidden');
        $('.dashboard-title').text('Groups of words');
        cardsContainer.removeClass('hidden');
        $('.group-options').removeClass('hidden');
        $('.word-options').addClass('hidden');
    }

});