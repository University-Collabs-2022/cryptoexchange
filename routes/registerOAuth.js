var express = require("express");
const Users = require("../models/users.js");
const constants = require("../constants/values.js");

const server = express();

server.use(express.json());

server.post('/auth/register',
  async (req, res) =>{
    const { username, email, password, phoneNumber } = req.body;
    const user = {
        username,
        email,
        provider: "register",
        password,
        phoneNumber,
    }
    const entry = {
        userId: "id1",
        ...user,
    };

    const userReq = await Users.findOne(user);

    if(!userReq) {
        await Users.create({
            ...entry
        }).then(user =>
            res.status(200).json({
            message: "User successfully created",
            user,
            })
            // res.redirect(`/api/users/${user.id}`);
        )
    } else {
        res.status(401).json({
          message: "User not created",
        });
        // res.redirect(constants.UNAUTHORIZED_URL);
    }
});

module.exports = server;