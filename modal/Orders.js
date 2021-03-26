const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const order = mongoose.model(
  "order",
  new Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    status: { type: String, default: "pending" },
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    billing: {
      type: Array,
      name: { type: String, required: true },
      address: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      pinCode: { type: String, required: true },
    },
    // shipping: {
    //   type: Array,
    //   name: { type: String, required: true },
    //   address: { type: String, required: true },
    //   state: { type: String, required: true },
    //   city: { type: String, required: true },
    //   pinCode: { type: String, required: true },
    // },
  })
);
module.exports = order;
