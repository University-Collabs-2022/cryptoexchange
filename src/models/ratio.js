const mongoose = require("mongoose");

const ratioSchema = mongoose.Schema({
    baseCurrencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency'
    },

    exchangeCurrencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Currency'
    },

    ratio: {
        type: Number,
        required: true,
    }
});

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;
