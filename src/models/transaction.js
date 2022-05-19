const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },

    baseCurrencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency'
    },

    exchangeCurrencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency'
    },

    baseCurrencyAmount: {
        type: Number,
        required: true
    },

    exchangeCurrencyAmount: {
        type: Number,
        required: true
    },

    availableExchangeAmount: {
        type: Number,
        required: true
    },

    cryptoInWallet: {
        type: Number,
        required: true
    },

    currencyInWallet: {
        type: Number,
        required: true
    },

    transactionDate: {
        type: Date,
        default: Date.now
    }

});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
