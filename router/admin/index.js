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
    res.json("UNAUTHENTICATED");
  }
};

//!Adding categories
router.post("/add_categories", verifyUser, async (req, res) => {
  const result = await user.findOne({ _id: req.body.user_id });
  if (!result.isAdmin) {
    return res.json("Permission Denied!!!!");
  }
  const data = category({ categoryName: req.body.categoryName });
  await data.save();
  res.json("Successfully added this category!! Thank you");
});

//!Show all category
router.get("/categories", async (req, res) => {
  const allCategories = await category.find({});
  res.json(allCategories);
});

//!Adding Products
router.post("/add_product", verifyUser, async (req, res) => {
  try {
    const result = await user.findOne({ _id: req.body.user_id });
    if (!result.isAdmin) {
      return res.json("Permission Denied!!!!");
    }
    const data = product(req.body);
    await data.save();
    res.json("Successfully Added Product!!!");
  } catch (err) {
    res.json(err.message);
  }
});

//!Search by id product/categoruId
router.get("/product/:categoryId", async (req, res) => {
  // const result = await user.findOne({ _id: req.body.user_id });
  // if (!result.isAdmin) {
  //   return res.json("Permission Denied!!!!");
  // }
  const findedData = await product.find({ category: req.params.categoryId });
  res.json(findedData);
});

//!Show all products
router.get("/products", async (req, res) => {
  const allProducts = await product.find({});
  res.json(allProducts);
});

//!Show a specific product details
router.get("/singleProduct/:productId", async (req, res) => {
  const specificProduct = await product.find({ _id: req.params.productId });
  res.json(specificProduct);
});

//! Update a Product
router.put("/product/:productId", verifyUser, async (req, res) => {
  const result = await user.findOne({ _id: req.body.user_id });
  if (!result.isAdmin) {
    return res.json("Permission Denied!!!!");
  }
  const productData = await product.findOne({ _id: req.params.productId });
  //   res.json(req.body);
  if (!productData) {
    return res.json("Sorry No product available on this id!!!");
  }
  await product.updateMany(
    { _id: productData._id },
    {
      $set: {
        productName: req.body.productName,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
      },
    }
  );
  res.json("Successfully Updated Product!!!");
});

module.exports = router;
