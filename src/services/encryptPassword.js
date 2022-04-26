const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.encryptPassword = async function (password) {
    var pass;
    await bcrypt.hash(password, saltRounds).then(function(hash) {
        pass = hash;
    });
    return pass;
};