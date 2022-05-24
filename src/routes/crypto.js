const express = require("express");
const server = express();
const Currency = require("../models/currency.js");

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
    Currency.create(currency).then((currency) => {
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

server.get("/crypto", async (req, res) => {
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

module.exports = server;
