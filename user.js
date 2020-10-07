function getUsers() {
    var localUsers = JSON.parse(localStorage.getItem('users'));
    if (localUsers) return reviveUsersObject(localUsers);
    return new users();
}

function reviveUsersObject(oldUsers) {
    var newUsers = new users();
    oldUsers.getUser = newUsers.getUser;
    oldUsers.setUser = newUsers.setUser;
    oldUsers.userExist = newUsers.userExist;
    oldUsers.save = newUsers.save;
    Object.keys(oldUsers.userList).forEach(function (user) {
        reviveUser(oldUsers.userList[user]);
    });
    return oldUsers;
}

function reviveUser(deadUser) {
    var newUser = new user('', '');
    deadUser.addLanguage = newUser.addLanguage;
    deadUser.checkPassword = newUser.checkPassword;
}
class users {
    constructor() {
        this.userList = {};
        this.getUser = function (userName) {
            if (this.userExist(userName)) return this.userList[userName]
            return false;
        };
        this.setUser = function (userName, password) {
            if (this.userExist(userName)) return false; // user exists
            this.userList[userName] = new user(userName, password);
        };
        this.userExist = function (userName) {
            return userName in this.userList;
        };
        this.save = function () {
            localStorage.setItem("users", JSON.stringify(this));
        };

    }
}

class user {
    constructor(userName, password) {
        this.userName = userName;
        this.password = CryptoJS.MD5(password);
        this.languages = {};
        this.lastActive = "";
        this.addLanguage = function (language) {
            this.languages[language] = {
                example1: {}
            };
        }
        this.checkPassword = function (password) {
            var rightPassword = this.password.words;
            CryptoJS.MD5(password).words.forEach(function (item, i) {
                if (item != rightPassword[i]) return false;
            })

            return true
        }
    };


}