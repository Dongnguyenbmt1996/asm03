const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const {createJWT} = require('../untils/jwttoken')

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "admin", "consultant"],
    default: "customer",
  },
});

// userSchema.methods.signToken = function() {
//   const token = createJWT(this._id, this.email, this.role);
//   return token;
// }

module.exports = mongoose.model("User", userSchema);
