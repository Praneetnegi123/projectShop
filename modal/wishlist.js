const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlist = mongoose.model(
  "wishlist",
  new Schema({
    userId: { type: String },
    productId: { type: Array, required: true },
  })
);
module.exports = wishlist;
