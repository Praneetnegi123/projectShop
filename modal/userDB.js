const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const user = mongoose.model(
  "user",
  new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    gender:{type:String,required:true},
    address:{type:String,required:true},
    mobileNum:{type:Number,required:true},
    isValid: { type: Boolean, default: false },
    verifyCode: { type: String, default: null },
    isAdmin: { type: Boolean, default: false },
  })
);

module.exports = user;
