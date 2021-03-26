let router = require("express").Router();
require("dotenv").config();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var jwt = require("jsonwebtoken");
const user = require("../../modal/userDB");
const category = require("../../modal/category");
const product = require("../../modal/product");
const eMail = require("../../utils");
const wishlist = require("../../modal/wishlist");

//!Creating a Middleware
const verifyUser = async (req, res, next) => {
  try {
    const decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRTE_KEY
    );
    let userData = await user.findOne({ _id: decoded.id });
    if (userData) {
      req.body.user_id = decoded.id;
      next();
    }
  } catch {
    res.send("UNAUTHENTICATED");
  }
};

//!Adding products to the wishlist
router.post("/add_wishlist", verifyUser, async (req, res) => {
  const wishlistData = await wishlist.findOne({ userId: req.body.user_id });
  console.log("----", wishlistData);
  if (wishlistData) {
    if (wishlistData.productId.indexOf(req.body.productId) !== -1) {
      return res.send("Product already added in the wishlist");
    }
    wishlistData.productId.push(req.body.productId);
    await wishlistData.save();
    res.send("added to the wishlist");
  }
  if (!wishlistData) {
    const data = wishlist({
      userId: req.body.user_id,
      productId: req.body.productId,
    });
    await data.save();
    res.send("added to the wishlist");
  }
});

//! Show wishlist of particuler id
router.get("/wishlist", verifyUser, async (req, res) => {
  const data = await wishlist.findOne({ userId: req.body.user_id });
  let products = data.productId;
  let listOfProducts = [];
  for (let i of products) {
    let objOfProduct = await product.find({ _id: i });
    listOfProducts.push(objOfProduct);
  }
  res.json(listOfProducts);
});

//!delete a product from wishlist
router.delete("/wishlist", verifyUser, async (req, res) => {
  const data = await wishlist.findOne({ userId: req.body.user_id });
  let deleteIndex = data.productId.indexOf(req.body.productId);
  if(deleteIndex!=-1){
    let x = data.productId.splice(deleteIndex, 1);
    await data.save();
    res.send(`deleted successfully ${x}`);
  }
  res.send("Not found this product")
  
  
});

module.exports = router;
