$(document).ready(function () {
    /* main sections*/
    var loginPage = $(".login-page");
    var userProfile = $(".userProfile");
    var dashBoard = $(".dashboard");
    var testBoard = $(".test");

    /* login*/
    var inputName = $("#user-name");
    var inputPassword = $("#password-input");

    /* user profile*/
    var lanObj;
    var languageList = $(".select-language");
    var languagesWrapper = $('.languages-wrapper');

    /* dashboard*/
    var addGroupInput = $("#add-group-input");
    var addWordInput = $("#add-word-input");
    var addTransInput = $("#add-trans-input");
    var cardsContainer = $(".cards-container");
    var wordContainer = $(".words-container");
    var editWordBtn = $("#editWordButton");
    var editWordInput = $('#edit-word-input');
    var editTransInput = $('#edit-trans-input');
    var editGroupBtn = $("#editGroupButton");
    var deleteGroupBtn = $("#deleteGroupButton")
    var editGroupInput = $("#edit-group-input");


    /*test*/
    var newTest = $("start-new-test");
    var inputTestTranslate = $(".word-translated");
    var wordToTranslate = $(".word-to-translate");


    /* show messages to the user*/
    var infoWindow = $(".info-window");

    /* global vars as reference to current object */
    var users = getUsers();
    var currentUser = users.getUser('bernat');
    var currentLanguage = currentUser.languages['Spanish, Castilian'];
    var currentGroup;
    // currentLanguage.groups['bla'];

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
        //else if (($(event.target).hasClass('profile-languages') || $(event.target).parent().hasClass('profile-languages')) && !$(event.target).hasClass('modal-trigger')) {
        else if ($(event.target).hasClass('box') || $(event.target).parent().hasClass('box')) {
            var groupName = $(event.target).data("group") ? $(event.target).data("group") : $(event.target).parent().data("group");
            currentGroup = currentLanguage.groups[groupName]; // global reference to current group
            goToWords();
            populateWords();
        } else if ($(event.target).hasClass('editWord') || $(event.target).parent().hasClass('editWord')) modalEditWord($(event.target))
        else if ($(event.target).hasClass('deleteWord') || $(event.target).parent().hasClass('deleteWord')) deleteWord($(event.target));
        else if ($(event.target).hasClass('editGroup')) modalEditGroup($(event.target));
        else if ($(event.target).hasClass('deleteGroup')) modalDeleteGroup($(event.target));
        else if (event.target.id == "link-userProfile") backToProfile();
        else if (event.target.id == "link-test") {
            if (getAllWords().length < 2) message("Please add more words in order to make a test");
            else goToTest();
        } else if (event.target.id == "start-test") startTest();
        else if (event.target.id == "exitTestBtn") {
            resetTest();
            testBoard.addClass("hidden");
            goToDashboard();
        }

    });

    $(document).keydown(function () {
        var code = event.keyCode ? event.keyCode : event.which;
        if (!newTest.hasClass('hidden') && code == '8') removeChar();
        else if (code == '13' && testObject.started) nextWord();
    })

    editWordBtn.click(editWord);
    editGroupBtn.click(editGroup);
    deleteGroupBtn.click(function () {
        deleteGroup($(this).data('id'))
    });

    $('#wordOk').click(nextWord);
    $('#exit-test').click(modalexitTest);
    $('#btn-apiTranslate').click(translate);
    $('#link-test').click(goToTest);
    $('#link-userProfile').click(backToProfile);
    $('#link-dashboard').click(goToDashboard);
    $('.buttonBack').click(backToLogin);
    $('#addButton-group').click(createGroup);
    $('#addButton-word').click(createWord);
    $('.backToGroups').click(backToGroups);
    $('.inputTest').on('input', function () {
        var char = $('.inputTest').val();
        inputTestTranslate.append(char);
        $(this).val("");
    })

    function removeChar() {
        inputTestTranslate.text(inputTestTranslate.text().slice(0, -1));
    }


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
                currentUser.update();
                users.save();
            } else message('login failed, please check your username and password');
        }
    }

    function register() {
        var userName = inputName.val().trim();
        var password = inputPassword.val().trim();
        if (users.userExist(userName)) message('user already exists, please choose another username')
        else if (validateRegister("#user-name", "#password-input")) {
            currentUser = users.setUser(userName, password);
            currentUser.update();
            message('register successful!');
            goToProfile();
            populateUserProfile();
            users.save();
        }
    }

    /*----------------------------
    User profile
    ----------------------------*/

    function populateUserProfile() {
        $(".username-profile").text(currentUser.userName);
        $(".last-active").text(currentUser.lastActive);
        $(".user-icon").css("color", currentUser.color);
        var languages = currentUser.languages;
        Object.keys(languages).forEach(function (name) {
            populateLanguage(languages[name]);
        })
    }

    function populateLanguage(language) {
        var lanContainer = $('<div class="container row profile-languages"><span class = "language-label">' + language['name'] + '</span></div>');
        lanContainer.click(function () {
            currentLanguage = currentUser.languages[language['name']]; //  global reference to current language
            goToDashboard();
            populateGroups();
        })
        languagesWrapper.append(lanContainer);
    }

    function newLanguage() {
        var language = $(".select-language :selected");
        var newLanguage = currentUser.addLanguage(language.text(), language.val());
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
                var lanName = lanObj[code]['name'].replace(/;/g, ',');
                var lanOption = $('<option value = "' + code + '">' + lanName + '</option>');
                languageList.append(lanOption);
            })
        })
    }

    /* API english definition, YANDEX */
    var API_KEY = 'dict.1.1.20201011T152238Z.41523fec98a614e5.13f027bbbb05f475b2af097e5e9fd0b0e8197347';
    var ENDPOINT_TRANSLATE = 'https://dictionary.yandex.net/api/v1/dicservice.json/lookup?lang=';
    getavaliableLan();
    var transOptions;

    function getavaliableLan() {
        var query = 'https://dictionary.yandex.net/api/v1/dicservice.json/getLangs?key=' + API_KEY;
        axios.get(query).then(function (data) {
            transOptions = data.data;
        }).catch(function () {
            message("language not avaliable or word not found")
        })
    }

    function translate() {
        var word = addWordInput.val();
        var lanCode = 'en-' + currentLanguage.code;
        if (!transOptions.includes(lanCode)) message("Sorry, your language is not avaliable");
        else {
            var query = ENDPOINT_TRANSLATE + lanCode + '&text=' + word + '&key=' + API_KEY;
            axios.get(query).then(function (data) {
                addTransInput.val(data.data.def[0].tr[0].text);
            }).catch(function () {
                message("Word not found");
            })
        }
    }

    /*-----------------------
        Groups of words
    -------------------------*/
    function populateGroups() {
        var keys = Object.keys(currentLanguage.groups);
        if (!keys.length) emptyGroup();
        keys.forEach(function (item) {
            populateOneGroup(currentLanguage.groups[item]);
        })
    }

    function emptyGroup() {
        var emptyMessage = $('<div class="empty-message"> <p> Click the plus button to create your first group of words </p> <span class = "iconify empty-icon" data-icon = "fa-solid:box-open"data-inline = "false"> </span></div>');
        cardsContainer.append(emptyMessage);
    }

    function populateOneGroup(group) {
        var groupContainer = $('<div class="box dropbtn" data-group="' + group.name + '"><p>' + group.name + '</p></div>');
        var dropDown = $('<div class = "dropdown-content"> <a href = "#" class = "editGroup"> edit name </a> <a href="#" class="deleteGroup">delete group</a></div>');
        groupContainer.append(dropDown);
        cardsContainer.append(groupContainer);
    }

    function modalEditGroup(item) {
        var groupName = item.parent().parent().data("group");
        editGroupInput.val(groupName);
        $('#editGroupButton').data("id", groupName);
        $('#modal-editGroup').css({
            "display": "block"
        })
    }

    function editGroup() {
        var oldName = editGroupBtn.data("id");
        var newName = editGroupInput.val();
        if (newName == "") {
            message("please provide a group name");
            return;
        }
        var oldGroup = currentLanguage.deleteGroup(oldName);
        if (currentLanguage.groupExists(newName)) {
            message("'" + newName + "' already introduced");
            currentLanguage.setGroup(oldGroup);
        } else {
            oldGroup.name = newName;
            currentLanguage.setGroup(oldGroup); // if the argument type is an object, object added instead of making a new one
            $("#modal-editGroup").css({
                "display": "none"
            })
            users.save();
            $('*[data-group="' + oldName + '"]').data("group", newName);
            $('*[data-group="' + oldName + '"] >p').text(newName);
        }
    }

    function modalDeleteGroup(item) {
        var groupName = item.parent().parent().data("group");
        deleteGroupBtn.data("id", groupName);
        $('#modal-deleteGroup').css({
            "display": "block"
        })
    }

    function deleteGroup(groupName) {
        currentLanguage.deleteGroup(groupName);
        $('*[data-group="' + groupName + '"]').remove();
        $("#modal-deleteGroup").css({
            "display": "none"
        })
        users.save();
    }

    function createGroup() {
        var groupName = addGroupInput.val().trim();
        if (!groupName) message("the name of the group can't be blank.")
        else if (currentLanguage.groupExists(groupName)) message("group already exists.");
        else {
            $('.empty-message').remove();
            var newGroup = currentLanguage.setGroup(groupName);
            populateOneGroup(newGroup);
            users.save();
        }
    }
    /*------------------------
        words
    -------------------------- */
    function populateOneWord(word) {
        var wordTranslation = $('<div class="wordWrapper" data-id="' + word.wordName + '"> <div class="word"><span class = "wordName">' + word.wordName + '</span><span class="translation">' + word.translation + '</span></div><span class="iconify editWord" data-icon ="typcn-edit" data-inline = "false"></span><span class="iconify deleteWord" data-icon="entypo:trash" data-inline="false"></span></div>');
        wordContainer.append(wordTranslation);
    }

    function populateWords() {
        var words = currentGroup.wordsList;
        Object.keys(words).forEach(function (word) {
            populateOneWord(words[word]);
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
            populateOneWord(wordAdded);
        }
        addWordInput.val("");
        addTransInput.val("");
    }

    function modalEditWord(item) {
        var wordName = item.closest(".wordWrapper").data("id");
        editWordBtn.data("wordName", wordName);
        editWordInput.val(wordName);
        editTransInput.val(currentGroup.wordsList[wordName]['translation']);
        $("#modal-editWord").css({
            "display": "block"
        })
    }

    function editWord() {
        var oldName = editWordBtn.data("wordName");
        var word = editWordInput.val();
        var trans = editTransInput.val();
        if (word == "" || trans == "") {
            message("Please provide a word and a translation");
            return;
        }
        var oldWord = currentGroup.deleteWord(oldName);
        if (currentGroup.wordExists(word)) {
            message("'" + word + "' already introduced");
            currentGroup.addWord(oldWord); // if the first argument is an object, the whole object is added instead of creating one
        } else {
            currentGroup.addWord(word, trans);
            message("word successfully edited");
            $('*[data-id="' + oldName + '"]').data("id", word);
            $('*[data-id="' + oldName + '"] .wordName').text(word);
            $('*[data-id="' + oldName + '"] .translation').text(trans);
            $("#modal-editWord").css({
                "display": "none"
            })
            users.save();
        }
        addWordInput.val("");
        addTransInput.val("");
    }

    function deleteWord(item) {
        var wordContainer = item.closest(".wordWrapper");
        currentGroup.deleteWord(wordContainer.data("id"));
        wordContainer.remove();
    }

    /*TEST*/

    /* Test object*/
    var testObject = {
        wordNum: -1,
        score: 0,
        nextWord: false,
        started: false,
        wordsTest: []
    }

    function resetTest() {
        testObject.started = false;
        testObject.wordNum = -1;
        testObject.score = 0;
        testObject.wordsTest = [];
        testObject.nexWord = false
    }

    function startTest() {
        $('#inputTest').focus();
        var arrayWords = getAllWords();
        testObject.started = true;
        $('.start-new-test').removeClass('hidden');
        $('.test-info').addClass('hidden');
        if (arrayWords.length < 11) testObject.wordsTest = arrayWords;
        else {
            for (var i = 0; i < 10; i++) {
                var pos = Math.floor(Math.random() * arrayWords.length);
                testObject.wordsTest.push(arrayWords.splice(pos, 1));
            }
        }
        nextWord(true);
    }

    function getAllWords() {
        var arrayWords = [];
        Object.keys(currentLanguage.groups).forEach(function (group) {
            Object.keys(currentLanguage.groups[group].wordsList).forEach(function (word) {
                arrayWords.push(currentLanguage.groups[group].wordsList[word])
            })
        })
        return arrayWords;
    }

    function nextWord(first = false) {
        if (!first) {
            var translation = inputTestTranslate.text();
            if (translation == "") {
                message("translation can't be blank.");
                return;
            };
            var word = testObject.wordsTest[testObject.wordNum].wordName;
            // we check if the word introduced corresponds to the right translation
            if (translation.trim().toUpperCase() === word.trim().toUpperCase()) {
                testObject.score++;
                message("correct!!");
            } else message("Not correct!:(");

        }
        testObject.wordNum++;
        if (testObject.wordNum < testObject.wordsTest.length) {
            wordToTranslate.text(testObject.wordsTest[testObject.wordNum].wordName);
            inputTestTranslate.text("");
        } else {
            message('test finished, you guessed ' + testObject.score + ' words correctly');
            resetTest();
        };
    }

    function modalexitTest() {
        $('#modal-exitTest').css({
            "display": "block"
        });
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
        infoWindow.removeClass("hidden");
        setTimeout(function () {
            infoWindow.removeClass("show-info");
            setTimeout(() => infoWindow.addClass("hidden"), 1000);
        }, 1500);
    }
    /*---------------------------------
    Navigate trough the site
    ----------------------------------*/

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

    function backToProfile() {
        cardsContainer.empty();
        hideDashBoard();
        showProfile();
    }

    function goToDashboard() {
        $(".user-icon2").css("color", currentUser.color);
        $(".lan-dashboard").text(currentLanguage.name);
        $(".name-dashboard").text(currentUser.userName);
        $(".main-dashboard").removeClass('hidden');
        $(".navbar").removeClass('hidden');
        hideProfile();
        showDashBoard();
        backToGroups();
    }

    function goToWords() {
        cardsContainer.addClass('hidden');
        wordContainer.removeClass('hidden');
        $('.group-options').addClass('hidden');
        $('.dashboard-title').text(currentGroup.name);
        $('.word-options').removeClass('hidden');
    }

    function goToTest() {
        $(".main-dashboard").addClass('hidden');
        $(".navbar").addClass('hidden');
        testBoard.removeClass('hidden');
    }

    function backToGroups() {
        wordContainer.children().not(':first-child').remove(); // empty word container except for the label (first child)
        wordContainer.addClass('hidden');
        $('.dashboard-title').text('Groups of words');
        cardsContainer.removeClass('hidden');
        $('.group-options').removeClass('hidden');
        $('.word-options').addClass('hidden');
    }
});