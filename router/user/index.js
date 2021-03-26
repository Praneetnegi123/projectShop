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


//! Generating Random String
function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

//! Generating a token
const generateToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRTE_KEY);
};

//! Register A User
router.post("/register", async (req, res) => {
  try{
    req.body.verifyCode = makeid(40);
  const UserData = new user(req.body);
  await UserData.save();
  let id = await user.findOne({ email: req.body.email });
  eMail(req.body.email, `localhost:8080/verify/${id.verifyCode}`);
  res.send("Please check the your mail, and veryfy by clicking the link bellow");
  }catch(err){
    res.send(err.message)
  }
  
});

//! Confirming by email
router.get("/verify/:id", async (req, res) => {
  const result = await user.findOne({ verifyCode: req.params.id });
  await user.updateOne({ _id: result._id }, { $set: { isValid: true } });
  res.send("Yeah Now you can login.....(^_^)");
});

//!Login A User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userData = await user.findOne({ email: email });

  if (!userData) {
    return res.send("Not a User");
  }
  if (!userData.isValid) {
    return res.send("****Please Veriyfy User****");
  }
  if (userData.password == password) {
    res.send(generateToken(userData.id));
  } else {
    res.send("Wrong Password");
  }
});

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

//! Reset password
router.post("/generate_reset_pass_link", verifyUser, async (req, res) => {
  let userData = await user.find({ _id: req.body.user_id });
  eMail(userData[0].email, `localhost:8080/reset/${userData[0]._id}`);
  res.send("****Please check your mail**** (^_^)");
});

//!reset a password after generating it
router.post("/reset/:id", async (req, res) => {
  let userData = await user.find({ _id: req.params.id });
  await user.updateOne({
    _id: req.params.id,
    $set: { password: req.body.password },
  });
  res.send("Successfully Updated (^_^)");
});

//!########################################################ADMIN##############################################

module.exports = router;
