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

    message('Hola');

    function login() {
        var userName = inputName.val();
        var password = inputPassword.val();
        var user = users[userName];
        if (user && user.password == password) {

            // login successful

            message('login successful!');
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
            users.save();
        }
    }


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


    /* ===============js for index2.html ???? ===============*/


    /* Modals */
    $(".modal-trigger").click(function (e) {
        e.preventDefault();
        dataModal = $(this).attr("data-modal");
        $("#" + dataModal).css({
            "display": "block"
        });
        // $("body").css({"overflow-y": "hidden"}); //Prevent double scrollbar.
    });

    $(".close-modal, .modal-sandbox").click(function () {
        $(".modal").css({
            "display": "none"
        });
        // $("body").css({"overflow-y": "auto"}); //Prevent double scrollbar.
    });


    /* Add words  */
    var addButton = document.getElementById('addButton');
    var addInput = document.getElementById('itemInput');
    var listArray = [];
    function listItemObj(content) {
        this.content = '';
    }
    var changeToComp = function () {
        var parent = this.parentElement;
    }
    var removeItem = function () {
        var parent = this.parentElement.parentElement;
        parent.removeChild(this.parentElement);
        var data = this.parentElement.firstChild.innerText;
        for (var i = 0; i < listArray.length; i++) {
            if (listArray[i].content == data) {
                listArray.splice(i, 1);
                refreshLocal();
                break;
            }
        }
    }
    //function to change the words list array
    var changeListArray = function (data, status) {
        for (var i = 0; i < listArray.length; i++) {
            if (listArray[i].content == data) {
                listArray[i].status = status;
                refreshLocal();
                break;
            }
        }
    }
    //function to chage the dom of the words list
    var createItemDom = function (text, status) {
        var listItem = document.createElement('p');
        var itemLabel = document.createElement('label');
        var itemCompBtn = document.createElement('p');
        var itemIncompBtn = document.createElement('p');
        itemLabel.innerText = text;
        //itemIncompBtn.className = 'btn btn-danger';
        listItem.appendChild(itemLabel);
        listItem.appendChild(itemCompBtn);
        listItem.appendChild(itemIncompBtn);
        return listItem;
    }
    var refreshLocal = function () {
        var words = listArray;
        localStorage.setItem('addWord', JSON.stringify(words));
    }
    var addToList = function () {
        var newItem = new listItemObj();
        newItem.content = addInput.value;
        listArray.push(newItem);
        //add to the local storage
        refreshLocal();
        //change the dom
        var item = createItemDom(addInput.value);
        addWord.appendChild(item);
        addInput.value = '';
    }

    //function to clear words list array
    var clearList = function () {
        listArray = [];
        localStorage.removeItem('addWord');
        addWord.innerHTML = '';

    }

    window.onload = function () {
        var list = localStorage.getItem('addWord');

        if (list != null) {
            words = JSON.parse(list);
            listArray = words;

            for (var i = 0; i < listArray.length; i++) {
                var data = listArray[i].content;

                var item = createItemDom(data, listArray[i].status);
                addWord.appendChild(item);
            }

        }

    };
    //add an event binder to the button
    addButton.addEventListener('click', addToList);
    clearButton.addEventListener('click', clearList);

});