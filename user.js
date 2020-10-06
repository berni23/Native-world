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
    deadUser.addLanguage = newUser.addLanguage
    return deadUser;
}
class users {
    constructor() {
        this.userList = {};
        this.getUser = function (userName) {
            return this[userList][userName]
        };
        this.setUser = function (userName, password) {
            if (this.userExist(userName)) return false; // user exists
            this.userList[userName] = new user(userName, password);
        };
        this.userExist = function (userName) {
            return this.userList[userName] == true;
        };
        this.save = function () {
            localStorage.setItem("users", JSON.stringify(this));
        };
    }
}

class user {
    constructor(userName, password) {
        this.userName = userName;
        this.password = password;
        this.languages = {};
        this.lastActive = "";
        this.addLanguage = function (language) {
            this.languages[language] = {
                example1: {}
            };
        }
    }
}