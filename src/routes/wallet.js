const express = require("express");
const Users = require("../models/users.js");
const Wallet = require("../models/wallet.js");
const encrypt = require("../services/encryptPassword");
const server = express();
const currency = require("../services/currencyHelpers");
const constants = require("../constants/values");

server.use(express.json());

server.put("/Founds", async (req, res) => {
  const { username, amount, password } = req.body;

  const user = await Users.findOne({ username });
  const wall = await Wallet.findOne({ userId: user._id });
  const usdId = await currency.getCurrencyId(constants.usd);

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
    const usdIndex = wall.currency.findIndex(elm =>
      elm.currencyId.equals(usdId)
    )
    const totalAmount = wall.currency[usdIndex].amount + amount;
    wall.currency[usdIndex].amount = totalAmount;

    await Wallet.findOneAndUpdate({ userId: user._id, "currency.currencyId": usdId }, {
      "$set": { 'currency.$.amount': totalAmount }
    });

    res.status(200).json({
      message: "Succesful deposit",
      wall,
    });
  }

});

server.get("/api/getCurrency", async (req, res) => {

});

module.exports = server;
