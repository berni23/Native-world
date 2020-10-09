function getUsers() {
    var localUsers = JSON.parse(localStorage.getItem('users'));
    console.log(localUsers);
    if (localUsers) return reviveUsersObject(localUsers);
    return new users();
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
            return this.userList[userName];
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
        this.languages = {}; // language objects
        this.lastActive = now();
        this.addLanguage = function (name, code) {
            this.languages[name] = new language(name, code);
            return this.languages[name];
        };
        this.checkPassword = function (password) {
            var rightPassword = this.password.words;

            if (password.length != rightPassword.length) return false
            CryptoJS.MD5(password).words.forEach(function (item, i) {
                if (item != rightPassword[i]) return false;
            })
            return true;
        }

        this.deleteLanguage = function (languageName) {
            delete this.languages[languageName];
        }
    };
}
class language {
    constructor(name, code) {
        this.name = name,
            this.code = code,
            this.groups = {},
            this.groupExists = function (group) {
                return group in this.groups;
            }

        this.setGroup = function (nameGroup) {
            if (!this.groupExists(nameGroup)) {
                this.groups[nameGroup] = new group(nameGroup);
                return this.groups[nameGroup];
            }
            return false;
        }
        this.deleteGroup = function (nameGroup) {
            delete this.groups[nameGroup];
        }
    }

}


class group {
    constructor(groupName) {
        this.name = groupName;
        this.wordsList = {};
        this.addWord = function (wordName, translation) { //  + extras
            if (!this.wordExists(wordName)) {
                this.wordsList[wordName] = new word(wordName, translation);
                return this.wordsList[wordName];
            }
            return false;
        }
        this.wordExists = function (wordName) {
            return wordName in this.wordsList;
        }
    }
}
class word {
    constructor(wordName, translation) {
        this.wordName = wordName;
        this.translation = translation;
    }
}


/* revive functions*/
function reviveUsersObject(oldUsers) {
    oldUsers = reviver(oldUsers, new users())
    Object.keys(oldUsers.userList).forEach(function (oldUser) {
        reviveOneUser(oldUsers.userList[oldUser]);
    });
    return oldUsers;
}

function reviveOneUser(oldUser) {
    reviver(oldUser, new user(''));
    Object.keys(oldUser.languages).forEach(function (oldLanguage) {
        reviveLanguage(oldUser.languages[oldLanguage]);
    })
}

function reviveLanguage(oldLanguage) {
    reviver(oldLanguage, new language('', ''));
    Object.keys(oldLanguage.groups).forEach(function (groupName) {
        reviveGroups(oldLanguage.groups[groupName]);
    })
}

function reviveGroups(oldGroup) {
    reviver(oldGroup, new group('', ''));
}

function reviver(oldObj, newObj) {
    Object.keys(newObj).forEach(function (key) {
        if (typeof newObj[key] == 'function') oldObj[key] = newObj[key];
    })
    return oldObj;
}

function reviveUser(deadUser) {
    var newUser = new user('', '');
    deadUser.addLanguage = newUser.addLanguage;
    deadUser.checkPassword = newUser.checkPassword;
}



/* utils not dependent on the HTML*/
function now() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) month = "0" + month;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    var stringDate = month + "/" + day + "/" + date.getFullYear() + "  at " + hours + ":" + minutes;
    return stringDate;
}