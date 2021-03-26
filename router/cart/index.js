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
const cart = require("../../modal/cart");
const { route } = require("../user");

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

//!Add to cart(we have to give quantity and product id in the body)
router.post("/cart", verifyUser, async (req, res) => {
  const cartData = await cart.findOne({ userId: req.body.user_id });
  if (req.body.productId && req.body.quantity) {
    if (cartData) {
      cartData.products.push({
        productId: req.body.productId,
        quantity: req.body.quantity,
      });
      await cartData.save();
      res.json("Added to the cart");
    } else {
      const data = cart({
        userId: req.body.user_id,
        products: {
          productId: req.body.productId,
          quantity: req.body.quantity,
        },
      });
      await data.save();
      res.send("Successfully Added this product");
    }
  } else {
    res.send("Please enter the right key");
  }
});

//!display all Product
router.get("/cart", verifyUser, async (req, res) => {
  const dataOfUser = await cart.findOne({ userId: req.body.user_id });
  let da = [];
  for (let i of dataOfUser.products) {
    let productData = await product.findOne({ _id: i.productId });
    da.push(productData);
  }
  res.json(da);
});

//!Delete the product from cart , you have to give the productID in the body
router.delete("/cart", verifyUser, async (req, res) => {
  const data = await cart.findOne({ userId: req.body.user_id });
  data.products.forEach((element) => {
    if (element.productId == req.body.productId) {
      data.products.splice(element, 1);
    }
  });
  await data.save();
  res.json("Deleted this product successfully");
});

//!Update the product you have to give quantity
router.put("/cart", verifyUser, async (req, res) => {
  const data = await cart.findOne({ userId: req.body.user_id });
  // console.log("requested product====>",data.products)
  for(let i in data.products){
    
    if(req.body.productId==data.products[i].productId){
      let id=data.products[i].productId
      data.products.splice(i,1,{productId:id,quantity:req.body.quantity})
      data.save()
      res.send("Successfully Updated~")

    }}
});

module.exports = router;
