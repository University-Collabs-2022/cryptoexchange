const express = require("express");
const Users = require("../models/users.js");
const Wallet = require("../models/wallet.js");
const Currency = require("../models/currency.js");
const server = express();
const currency = require("../services/currencyHelpers");
const constants = require("../constants/values");
const Transaction = require("../models/transaction");


server.use(express.json());

server.post("/transaction", async (req, res) => {
    const { username, amount, baseCurrencyName, exchangeCurrencyName } = req.body;

    const user = await Users.findOne({ username });
    const wall = await Wallet.findOne({ userId: user._id });
    //const usdId = await currency.getCurrencyId(constants.usd);

    const baseCurrencyId = await currency.getCurrencyId(baseCurrencyName);
    const exchangeCurrencyId = await currency.getCurrencyId(exchangeCurrencyName);


    const baseCurrencyIndex = wall.currency.findIndex(elm =>
        elm.currencyId.equals(baseCurrencyId)
    );

    const exchangeCurrencyIndex = wall.currency.findIndex(elm =>
        elm.currencyId.equals(exchangeCurrencyId)
    );

    if (exchangeCurrencyIndex === -1) {
        const newCurrency = {
            currencyId: exchangeCurrencyId,
            amount: 0
        }
        console.log(newCurrency);
        await Wallet.updateOne(
            { _id: wall._id },
            { $push: { currency: newCurrency } }
        )
    }

    console.log(wall);


    const currencyForSold = await Currency.findOne({ currencyName: baseCurrencyName });
    const currencyForBuy = await Currency.findOne({ currencyName: exchangeCurrencyName });
    const boughtAmount = (amount * currencyForSold.ratio) / currencyForBuy.ratio;

    const transaction = {
        userId: user._id,
        baseCurrencyId: baseCurrencyId,
        exchangeCurrencyId: exchangeCurrencyId,
        baseCurrencyAmount: amount,
        exchangeCurrencyAmount: boughtAmount,
        availableExchangeAmount: currencyForBuy.availableAmount - boughtAmount,
        cryptoInWallet: wall.currency[baseCurrencyIndex].amount - amount,
        currencyInWallet: wall.currency[exchangeCurrencyIndex].amount + boughtAmount,
        date: Date.now,
    }

    await Transaction.create({
        ...transaction,
    }).then(async transaction => {
        await Wallet.findOneAndUpdate({ userId: user._id, "currency.currencyId": baseCurrencyId }, {
            "$set": { 'currency.$.amount': wall.currency[baseCurrencyIndex].amount - amount }
        });
        await Wallet.findOneAndUpdate({ userId: user._id, "currency.currencyId": exchangeCurrencyId }, {
            "$set": { 'currency.$.amount': wall.currency[exchangeCurrencyIndex].amount + boughtAmount }
        });
        res.status(200).json({
            message: "Transaction created successfully",
            transaction,
        })
    }
    )

});

module.exports = server