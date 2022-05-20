const Currency = require("../models/currency.js");

module.exports.getCurrencyId = async (currencyName) => {
  const currency = await Currency.findOne({ currencyName });
  return currency._id;
};

module.exports.getCurrencyNameAndPrice = async (_id) => {
  const currency = await Currency.findOne({ _id });
  const currencyObj = {
    name: currency.currencyName,
    price: currency.ratio,
  };
  return currencyObj;
};
