function getUsers() {

    var users = JSON.parse(localStorage.getItem('users'));

    if (users) return users;

    else return {};

}


function getUser(userName) {
    return getUsers()[userName];
}

function setUser(username, password) {

    var users = getUsers();
    if (users[username]) return false;

    else {

        users[username] = newUser;
        localStorage.setItem(JSON.stringify(users));
    }


}



// create user


function createUser(userName, password) {

    // methods

    var user = {
        name: userName,
        password: password,
        languages: {

        },
        lastActive
    }


    return user;

    //setUser(user);

}

createUser.prototype.createLanguage = function (language) {
    this.languages[language] = {};

}