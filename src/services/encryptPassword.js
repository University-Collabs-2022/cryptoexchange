const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.encryptPassword = async function (password) {
    let pass;
    await bcrypt.hash(password, saltRounds).then(function (hash) {
        pass = hash;
    });
    return pass;
};

module.exports.comparePassword = async function (password, dbPassword) {
    let result;
    await bcrypt.compare(password, dbPassword).then(function (response) {
        result = response;
    });
    return result;
};