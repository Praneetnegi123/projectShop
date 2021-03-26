let router = require("express").Router();
require("dotenv").config();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var jwt = require("jsonwebtoken");
const user = require("../../modal/userDB");
const category = require("../../modal/category");
const product = require("../../modal/product");
const order = require("../../modal/Orders");
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

router.post("/order", verifyUser, async (req, res) => {
  try {
    let ord = order(req.body);
    await ord.save();
    res.json("added to the order~");
  }catch(err){res.send(err)}
});

module.exports = router;
