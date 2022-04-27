const mongoose = require("mongoose");

const walletSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },

    currecy: [{
        currencyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Currency'
        },

        amount: {
            type: Number,
            require: true
        },
    }
    ]
});

//walletSchema.index({ userId: 1, email: 1 });

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;