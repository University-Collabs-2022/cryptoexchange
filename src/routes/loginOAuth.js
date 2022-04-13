var express = require("express");
const Users = require("../models/users.js");
const constants = require("../constants/values.js");

const server = express();

server.use(express.json());

server.post('/auth/login',
  async (req, res) =>{
    const { username } = req.body
    const user = await Users.findOne({ username });
    if (!user) {
      res.status(401).json({
        message: "Login not successful",
        error: "401: User not found",
      });
      // res.redirect(constants.UNAUTHORIZED_URL);
    } else {
      await Users.updateOne(user, { lastLogin: new Date() });
      res.status(200).json({
        message: "Login successful",
        user,
      })
      // res.redirect(`/api/users/${user.id}`);
    }
});

module.exports = server;