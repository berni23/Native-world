function getUsers() {
    var localUsers = JSON.parse(localStorage.getItem('users'));
    console.log(localUsers);
    if (localUsers) return reviveUsersObject(localUsers);
    return new users();
}

function reviveUsersObject(oldUsers) {
    // var newUsers = new users();
    oldUsers = reviver(oldUsers, new users())
    /*  oldUsers.getUser = newUsers.getUser;
        oldUsers.setUser = newUsers.setUser;
        oldUsers.userExist = newUsers.userExist;
        oldUsers.save = newUsers.save;
        */
    var newUser = new user();
    Object.keys(oldUsers.userList).forEach(function (user) {
        reviver(oldUsers.userList[user], newUser);
    });
    return oldUsers;
}


function reviver(oldObj, newObj) {
    Object.keys(newObj).forEach(function (key) {
        if (typeof newObj[key] == 'function') {
            oldObj[key] = newObj[key]
        }
    })

    return oldObj;
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
        this.languages = {}; // language objects
        this.lastActive = now();
        this.addLanguage = function (name, code) {
            this.languages[name] = new language(name, code);
        };
        this.checkPassword = function (password) {
            var rightPassword = this.password.words;
            CryptoJS.MD5(password).words.forEach(function (item, i) {
                if (item != rightPassword[i]) return false;
            })
            return true
        }
    };
}


class language {
    constructor(name, code) {
        this.name = name,
            this.code = code,
            this.groups = {},
            this.groupExists = function (group) {
                return this.groups[group] == true;
            }
        this.deleteGroup = function (nameGroup) {
            delete this.groups[nameGroup];
        }

    }
}

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

/*var encryptedAES = CryptoJS.AES.encrypt("Message", "My Secret Passphrase");
var decryptedBytes = CryptoJS.AES.decrypt(encryptedAES, "My Secret Passphrase");
var plaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);

*/