const Currency = require("../models/currency.js")

module.exports.getCurrencyId = async currencyName => {
    const currency = await Currency.findOne({ currencyName });
    return currency._id;
};
