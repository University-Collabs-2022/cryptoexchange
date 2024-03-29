const express = require("express");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const constants = require("../constants/values.js");
const Users = require("../models/users.js");

const server = express();

const GITHUB_CLIENT_ID = "b1cb3875404707d0ca4c";
const GITHUB_CLIENT_SECRET = "a61cc8195dd3dc34107f389ede5943fb3962d3f4";

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:1234/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  )
);

server.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
server.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: constants.UNAUTHORIZED_URL,
  }),
  async function (req, res) {
    const { displayName, username, provider } = req.user;
    const entry = {
      username,
      displayName,
      provider,
    };
    const qRes = await Users.findOne({ username });
    if (!qRes) {
      await Users.create(entry);
    } else {
      await Users.updateOne({ username }, { lastLogin: new Date() });
    }
    res.redirect(`/api/users/${req.user.username}`);
  }
);

module.exports = server;
