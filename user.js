function getUsers() {

    var localUsers = eval(JSON.parse(localStorage.getItem('users')));
    if (localUsers) return localUsers;

    localUsers = new users();
    localStorage.getItem(JSON.stringify(localUsers));

    return localUsers;

}


class users {
    constructor() {
        /* this.getUser = getUser();
         this.setUser = setUser();
         this.userExist = userExist();
         */

    }

    //public methods

    // getter
    getUser(userName) {
        return this[userName]
    }

    //setter
    setUser(userName, password) {
        if (this.userExist(userName)) return false; // user exists
        this[userName] = new user(userName, password);

    }

    userExist(userName) {
        return this[userName] == true;
    }


}

class user {
    constructor(userName, password) {
        this.userName = userName;
        this.password = password;
        this.languages = {};
        this.lastActive = "";

    }
    createLanguage(language) {
        this.languages[language] = {};

    }
}