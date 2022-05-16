const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const constants = require("../constants/values.js");
const Users = require("../models/users.js");

const server = express();

const GOOGLE_CLIENT_ID =
  "45064056279-45qso7g003cin5hvo5cogi1ihp5o91oe.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:1234/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  )
);

server.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

server.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: constants.UNAUTHORIZED_URL,
  }),
  async function (req, res) {
    const { displayName, emails } = req.user;
    const filter = { email: emails[0].value, displayName };
    const entry = {
      ...filter,
      provider: "google",
    };
    const qRes = await Users.findOne(filter);
    if (!qRes) {
      await Users.create(entry);
    } else {
      await Users.updateOne(filter, { lastLogin: new Date() });
    }
    res.redirect(`/api/users/${req.user.displayName}`);
  }
);

module.exports = server;
