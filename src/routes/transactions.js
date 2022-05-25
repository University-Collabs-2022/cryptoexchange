const express = require("express");
const Users = require("../models/users.js");
const Wallet = require("../models/wallet.js");
const Currency = require("../models/currency.js");
const server = express();
const currency = require("../services/currencyHelpers");
const Transaction = require("../models/transaction");
const constants = require("../constants/values");
const isAuth = require("../middleware/isAuth");

server.use(express.json());

server.post("/transaction", isAuth, async (req, res) => {
  const { amount, baseCurrencyName, exchangeCurrencyName } = req.body;
  
  const username = req.session.passport.user.username;
  const user = await Users.findOne({ username });
  const wall = await Wallet.findOne({ userId: user._id });
  const baseCurrencyId = await currency.getCurrencyId(baseCurrencyName);
  const exchangeCurrencyId = await currency.getCurrencyId(exchangeCurrencyName);
  const usdId = await currency.getCurrencyId(constants.usd);

  if (baseCurrencyId === null || exchangeCurrencyId === null) {
    return res.status(404).json({
      message: "Currency not found",
    });
  }

  const baseCurrencyIndex = wall.currency.findIndex((elm) =>
    elm.currencyId.equals(baseCurrencyId)
  );

  const exchangeCurrencyIndex = wall.currency.findIndex((elm) =>
    elm.currencyId.equals(exchangeCurrencyId)
  );

  const usdIndex = wall.currency.findIndex((elm) =>
    elm.currencyId.equals(usdId)
  );

  const currencyForSold = await Currency.findOne({
    currencyName: baseCurrencyName,
  });
  const currencyForBuy = await Currency.findOne({
    currencyName: exchangeCurrencyName,
  });
  const boughtAmount = (amount * currencyForSold.ratio) / currencyForBuy.ratio;

  let usdAmount = 0;
  let cryptoAmount = 0;

  if (baseCurrencyIndex === usdIndex) {
    usdAmount = amount;
    cryptoAmount = -1 * boughtAmount;
  } else if (exchangeCurrencyIndex === usdIndex) {
    usdAmount = -1 * boughtAmount;
    cryptoAmount = amount;
  }

  const cryptoCurrencyIndex =
    exchangeCurrencyIndex === usdIndex
      ? baseCurrencyIndex
      : exchangeCurrencyIndex;

  const transaction = {
    userId: user._id,
    baseCurrencyId: baseCurrencyId,
    exchangeCurrencyId: exchangeCurrencyId,
    baseCurrencyAmount: amount,
    exchangeCurrencyAmount: boughtAmount,
    availableExchangeAmount: currencyForBuy.availableAmount - boughtAmount,
    cryptoInWallet: wall.currency[cryptoCurrencyIndex].amount - cryptoAmount,
    currencyInWallet: wall.currency[usdIndex].amount - usdAmount,
    date: Date.now,
  };

  if (exchangeCurrencyIndex === -1) {
    const newCurrency = {
      currencyId: exchangeCurrencyId,
      amount: 0,
    };

    await Wallet.updateOne(
      { _id: wall._id },
      { $push: { currency: newCurrency } }
    );
  }

  if (transaction.availableExchangeAmount < 0) {
    res.status(406).json({
      message: "Insufficient crypto amount",
    });
  } else if (transaction.cryptoInWallet < 0) {
    res.status(406).json({
      message: "Insufficient funds",
    });
  } else if (transaction.currencyInWallet < 0) {
    res.status(406).json({
      message: "Insufficient funds",
    });
  } else {
    await Transaction.create({
      ...transaction,
    }).then(async (transaction) => {
      await Wallet.findOneAndUpdate(
        { userId: user._id, "currency.currencyId": baseCurrencyId },
        {
          $set: {
            "currency.$.amount":
              wall.currency[baseCurrencyIndex].amount - amount,
          },
        }
      );
      await Wallet.findOneAndUpdate(
        { userId: user._id, "currency.currencyId": exchangeCurrencyId },
        {
          $set: {
            "currency.$.amount":
              wall.currency[exchangeCurrencyIndex].amount + boughtAmount,
          },
        }
      );
      await Currency.findOneAndUpdate(
        { currencyName: exchangeCurrencyName },
        {
          $set: { availableAmount: transaction.availableExchangeAmount },
        }
      );
      res.status(200).json({
        message: "Transaction created successfully",
        transaction,
      });
    });
  }
});

server.get('/transaction-history', isAuth, async (req, res) => {
  const userId = req.session.passport.user._id;
  const transactions = await Transaction.find({userId: userId});
  const response = [];

  if (!transactions) {
    return res.status(204).json({
      message: "No transactions"
    });
  }

  for (const transaction of transactions) {
    const baseCurrency = await Currency.findById(transaction.baseCurrencyId);
    const exchangeCurrency = await Currency.findById(transaction.exchangeCurrencyId);
    const  {
      baseCurrencyAmount,
      exchangeCurrencyAmount,
      availableExchangeAmount,
      cryptoInWallet,
      currencyInWallet,
      transactionDate
  } = transaction;
  
    response.push({
      baseCurrencyName: baseCurrency.currencyName,
      exchangeCurrencyName: exchangeCurrency.currencyName,
      baseCurrencyAmount,
      exchangeCurrencyAmount,
      availableExchangeAmount,
      cryptoInWallet,
      currencyInWallet,
      transactionDate
    })
  }

  return  res.status(200).json({
      message: "Transactions were successfully retrieved",
      response
    });
})

module.exports = server;
