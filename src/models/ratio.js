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

//walletSchema.index({ userId: 1, email: 1 });

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;
