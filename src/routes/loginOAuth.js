const express = require("express");
const Users = require("../models/users.js");
const bcrypt = require("bcrypt");
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
      validPassword = res;
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

server.post("/auth/changePassword", async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  const user = await Users.findOne({ username });
  if (!user) {
    return res.status(401).json({
      message: "Username not found",
      error: "401: User not found",
    });
  }

  if (user.password) {
    let validPassword;
    await encrypt.comparePassword(oldPassword, user.password).then((res) => {
      validPassword = res
    });

    if (!validPassword) {
      return res.status(402).json({
        message: "Incorrect password!",
        error: "402: Incorrect password",
      });

    }

    let encryptedPassword
    await encrypt.encryptPassword(newPassword).then(encryptedPass => {
      encryptedPassword = encryptedPass;
    })

    await Users.updateOne(
      { _id: user._id },
      { $set: { password: encryptedPassword } }
    );
    return res.status(200).json({
      message: "Password updated successfully"
    });
  }

});

module.exports = server;
