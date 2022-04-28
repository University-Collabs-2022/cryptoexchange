const express = require("express");
const server = express();
const Currency = require("../models/currency.js");

server.use(express.json());

server.post("/addCrypto", async (req, res) => {
  const { currencyName, ratio, availableAmount } = req.body;

  const currency = {
    currencyName,
    ratio,
    availableAmount
  }

  const currencyReq = await Currency.findOne({ currencyName });

  if (!currencyReq) {
    await Currency.create(
      currency
    ).then(currency => {
      res.status(200).json({
        message: "Currency created successfully",
        currency,
      })
    }
    )
  } else {
    res.status(401).json({
      message: "Currency not added",
    });
  }
});


module.exports = server;
