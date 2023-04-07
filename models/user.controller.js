const { genPassword } = require("../utils/passwordUtils.js");
const User = require("./user.model.js");

const createUser = (username, password) => {
    console.log("USername + password : " + username + " et " + password);
    const saltHash = genPassword(password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;
  
    User.create({
        username: username,
        hash: salt,
        salt: hash,
        admin: true
    }).then(res => {
        console.log(res);
        return true;
    }).catch((error) => {
        console.error('Failed to create a new record : ', error);
    });
}

const getUser = (username) => {
    User.findOne({
        where: {
            username : username
        }
    }).then(res => {
        console.log(res);
        return res;
    }).catch((error) => {
        console.error('User non trouvé : ', error);
    });
}

const getUserById = (userId) => {
    User.findOne({
        where: {
            id : userId
        }
    }).then(res => {
        console.log(res);
        return res;
    }).catch((error) => {
        console.error('User non trouvé : ', error);
    });
}

module.exports = {
    createUser,
    getUser,
    getUserById
};