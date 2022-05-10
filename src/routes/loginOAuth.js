const express = require("express");
const Users = require("../models/users.js");
const bcrypt = require('bcrypt');
const encrypt = require("../services/encryptPassword");

const server = express();

server.use(express.json());

server.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ username });
  if (!user) {
    res.status(401).json({
      message: "Login not successful",
      error: "401: User not found",
    });
  } else {

    let validPassword;
    await encrypt.comparePassword(password, user.password).then((res) => {
      validPassword = res
    });


    if (!validPassword) {
      res.status(402).json({
        message: "Incorrect password!",
        error: "402: Incorrect password",
      });
    } else {
      if (user.provider === "register") {
        await Users.updateOne(user, { lastLogin: new Date() });
        res.status(200).json({
          message: "Login successful",
          user,
        });
      }
    }
  }
});

module.exports = server;
