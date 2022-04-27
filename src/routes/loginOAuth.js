const express = require("express");
const Users = require("../models/users.js");

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
    let encrPassword;
    await encrypt.encryptPassword(password).then((encryptedPass) => {
      encrPassword = encryptedPass;
    });

    const validPassword = await bcrypt.compare(encrPassword, user.password);
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
