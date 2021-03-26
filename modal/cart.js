const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cart = mongoose.model(
  "cart",
  new Schema({
    userId: { type: String },
    products: { type: Array, required: true },
  })
);
module.exports = cart;
