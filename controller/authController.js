const { User, validate } = require("../models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const config = require('config')

const handleErrors = (err) => {
  console.log(err.message, err.code);
};
const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, config.get('jwtPrivateKey'), {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;

  try {
    const user = await User.create({
      email,
      password,
    });
    
    res.status(201).json(user);
  } catch (error) {
    handleErrors(error);
    res.status(400).send("error, user not created");
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (error) {
    res.status(400).json();
  }
};

module.exports.logout_get = (req, res) => {
  // Need to delete JWT cookie
  res.cookie("jwt", " ", { maxAge: 1 });
  res.redirect("/");
};
