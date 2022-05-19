const express = require("express");
const Users = require("../models/users.js");
const Wallet = require("../models/wallet.js");
const encrypt = require("../services/encryptPassword");
const server = express();
const currency = require("../services/currencyHelpers");
const constants = require("../constants/values");
const { getCurrencyNameAndPrice } = require("../services/currencyHelpers.js");

server.use(express.json());

server.put("/founds", async (req, res) => {
  const { username, amount, password } = req.body;

  const user = await Users.findOne({ username });
  const wall = await Wallet.findOne({ userId: user._id });
  const usdId = await currency.getCurrencyId(constants.usd);

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
    const usdIndex = wall.currency.findIndex((elm) =>
      elm.currencyId.equals(usdId)
    );
    const totalAmount = wall.currency[usdIndex].amount + amount;
    wall.currency[usdIndex].amount = totalAmount;

    await Wallet.findOneAndUpdate(
      { userId: user._id, "currency.currencyId": usdId },
      {
        $set: { "currency.$.amount": totalAmount },
      }
    );

    res.status(200).json({
      message: "Succesful deposit",
      wall,
    });
  }
});

server.get("/wallet", async (req, res) => {
  const { username } = req.query;

  const user = await Users.findOne({ username });
  const wallet = await Wallet.findOne({ userId: user._id });
  let response = [];

  if (!wallet) {
    res.status(404).json({
      message: "Wallet not found",
    });
  } else {
    for (let element of wallet.currency) {
      const currencyObj = await currency.getCurrencyNameAndPrice(element.currencyId);
      currencyObj["amount"] = element.amount;
      response.push(currencyObj);
    }

    res.status(200).json({
      message: "Available Crypto retrieved successfully",
      response,
    });
  }
});

module.exports = server;
