const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const category = mongoose.model(
  "category",
  new Schema({
    categoryName: { type: String, required: true },
    status: { type: Boolean, default: true },
  })
);
module.exports = category;
