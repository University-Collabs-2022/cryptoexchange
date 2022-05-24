const express = require("express");
const Users = require("../models/users.js");
const encrypt = require("../services/encryptPassword");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const server = express();

server.use(express.json());

passport.use(
  new LocalStrategy((username, password, done) => {
    Users.findOne({ username: username }, async (err, user) => {
      if (!user) {
        return done(null, false);
      }
      if (err) {
        return done(err);
      }
      
      let validPassword;
      await encrypt.comparePassword(password, user.password).then((res) => {
        validPassword = res;
      });

      if (validPassword) {
        await Users.updateOne(user, { lastLogin: new Date() });
        done(null, user);
      } else return done(null, false);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

server.post(
  "/auth/login",
  passport.authenticate("local", {
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect(`/api/users/${req.session.passport.user.id}`);
  }
);

module.exports = server;
