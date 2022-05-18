const express = require("express");
const server = express();
const Currency = require("../models/currency.js");
const Users = require("../models/users.js");
const Wallet = require("../models/wallet.js");

server.use(express.json());

server.post("/addCrypto", async (req, res) => {
  const { currencyName, ratio, availableAmount } = req.body;

  const currency = {
    currencyName,
    ratio,
    availableAmount,
  };

  const currencyReq = await Currency.findOne({ currencyName });

  if (!currencyReq) {
    await Currency.create(currency).then((currency) => {
      res.status(200).json({
        message: "Currency created successfully",
        currency,
      });
    });
  } else {
    res.status(401).json({
      message: "Currency not added",
    });
  }
});

server.get("/AvailableCryptoToBuy", async (req, res) => {
  const AvailableCryptoToBuy = await Currency.find();

  if (!AvailableCryptoToBuy) {
    res.status(404).json({
      message: "Crypto not found",
    });
  } else {
    res.status(200).json({
      message: "Available Crypto retrieved successfully",
      AvailableCryptoToBuy,
    });
  }
});

server.get("/AvailableCryptoToSell", async (req, res) => {
  const { username } = req.body;

  const user = await Users.findOne({ username });
  const wallet = await Wallet.findOne({ userId: user._id });

  
 

  if (!wallet) {
    res.status(404).json({
      message: "Wallet not found",
    });
  } else {

    res.status(200).json({
      message: "Available Crypto retrieved successfully",
      wallet,
    });
  }
});

module.exports = server;
