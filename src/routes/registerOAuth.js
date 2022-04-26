var express = require("express");
const Users = require("../models/users.js");
var encrypt = require("../services/encryptPassword")
const server = express();

server.use(express.json());

server.post('/auth/register',
  async (req, res) =>{
      const { displayName, username, email, password } = req.body;

      var encryptedPassword;
      await encrypt.encryptPassword(password).then(encryptedPass => {
        encryptedPassword = encryptedPass;
      })

    const user = {
        displayName,
        username,
        email,
        provider: "register",
        password: encryptedPassword,
    }

    const userReq = await Users.findOne({ username });

    if(!userReq) {
        await Users.create({
            ...user
        }).then(user =>
            res.status(200).json({
            message: "User successfully created",
            user,
            })
        )
    } else {
        res.status(401).json({
          message: "User not created",
        });
    }
});

module.exports = server;