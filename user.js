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
        this.color = getRandomColor();
        this.languages = {}; // language objects
        this.lastActive = now();
        // update user. for the moment only updating the 'last active' property, but could be used for further upadtes
        this.update = function () {
            this.lastActive = now();
        }
        this.addLanguage = function (name, code) {
            this.languages[name] = new language(name, code);
            return this.languages[name];
        };
        this.checkPassword = function (password) {
            var rightPassword = this.password.words;
            //if (password.length != rightPassword.length) return false
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
            if (typeof nameGroup == "object") {
                this.groups[nameGroup.name] = nameGroup;
                return this.groups[nameGroup.name];
            }
            this.groups[nameGroup] = new group(nameGroup);
            return this.groups[nameGroup];
        }
        this.deleteGroup = function (nameGroup) {
            var groupDeleted = this.groups[nameGroup];
            delete this.groups[nameGroup];
            return groupDeleted;
        }
    }
}

class group {
    constructor(groupName) {
        this.name = groupName;
        this.wordsList = {};
        this.addWord = function (wordName, translation) { //  + extras
            if (typeof wordName == 'object') this.wordsList[wordName.wordName] == wordName;
            else this.wordsList[wordName] = new word(wordName, translation);
            return this.wordsList[wordName];
        }
        this.wordExists = function (wordName) {
            return wordName in this.wordsList;
        }
        this.deleteWord = function (wordName) {
            var deletedWord = this.wordsList[wordName];
            delete this.wordsList[wordName];
            return deletedWord;
        }
    }
}
class word {
    constructor(wordName, translation) {
        this.wordName = wordName;
        this.translation = translation;
    }
}


/*-----------------------------
revive functions
-------------------------------*/

// generalReviver
function reviver(oldObj, newObj) {
    Object.keys(newObj).forEach(function (key) {
        if (typeof newObj[key] == 'function') oldObj[key] = newObj[key];
    })
    return oldObj;
}

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


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}