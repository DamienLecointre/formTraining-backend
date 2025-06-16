var express = require("express");
var router = express.Router();
const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");
const User = require("../models/users");

// ROUTE POST : USER SIGN UP

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!checkBody(req.body, ["firstName", "lastName", "email", "password"])) {
      return res
        .status(400)
        .json({ result: false, error: "Missing or empty fields" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        result: false,
        error: "Wrong email format",
      });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        result: false,
        error:
          "Password have to include a minimum of 8 characters, an uppercase letter, a lowercase letter, a number and a special character.",
      });
    }
    const existingUser = await User.findOne({
      email: { $regex: new RegExp(email, "i") },
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ result: false, error: "Email already used" });
    }

    const hash = bcrypt.hashSync(password, 10);
    const token = uid2(32);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hash,
      token,
      inscriptionDate: new Date(),
    });
    const savedUser = await newUser.save();
    res.status(201).json({
      result: true,
      message: "User created successfully",
      user: {
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        password: savedUser.password,
        token: savedUser.token,
        inscriptionDate: savedUser.inscriptionDate,
      },
    });
  } catch {
    res.status(500).json({ result: false, error: "Error saving user" });
  }
});

module.exports = router;
