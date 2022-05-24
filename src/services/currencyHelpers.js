const Currency = require("../models/currency.js");

module.exports.getCurrencyId = async (currencyName) => {
  const currency = await Currency.findOne({ currencyName });
  if (!currency) {
    return null;
  }
  return currency._id;
};
