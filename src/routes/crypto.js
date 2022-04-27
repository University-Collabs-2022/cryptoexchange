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

  await Currency.create(
    ...currency
  )

});

module.exports = server;
