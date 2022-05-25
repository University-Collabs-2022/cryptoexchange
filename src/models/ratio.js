const mongoose = require("mongoose");

const ratioSchema = mongoose.Schema({
  currencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Currency",
  },

// The ratio compared to USD 
  ratio: {
    type: Number,
    required: true,
  },
});

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;
