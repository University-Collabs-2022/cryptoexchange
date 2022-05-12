const mongoose = require("mongoose");

const currencySchema = mongoose.Schema({

    currencyName: {
        type: String,
        required: true,
        unique: true
    },

    ratio: {
        type: Number,
        required: true,
    },

    availableAmount: {
        type: Number,
        required: true
    },

});

//currencySchema.index({ userId: 1, email: 1 });

const Currency = mongoose.model("Currency", currencySchema);

module.exports = Currency;
