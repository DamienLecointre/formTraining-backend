const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  token: String,
  inscriptionDate: Date,
});

const User = mongoose.model("users", userSchema);

module.exports = User;
