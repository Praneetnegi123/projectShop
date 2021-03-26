require("dotenv").config();
const express = require("express");
const app = express();
let user = require("./router/user");
let admin = require("./router/admin");
let wishlist = require("./router/wishlist");
let cart = require("./router/cart");
let order = require("./router/order");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/shopDB2", {
  useNewUrlParser: true,
});

app.use("/", user);
app.use("/", admin);
app.use("/", wishlist);
app.use("/", cart);
app.use("/",order);

app.listen(8080, () => console.log("--- listening at port 8080---"));
