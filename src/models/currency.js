const mongoose = require("mongoose");

const currencySchema = mongoose.Schema({
  currencyName: {
    type: String,
    required: true,
    unique: true,
  },

  ratio: {
    type: Number,
    required: true,
  },

  availableAmount: {
    type: Number,
    required: true,
  },
});

const Currency = mongoose.model("Currency", currencySchema);

module.exports = Currency;
