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
