const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "asrin secret", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id)
        console.log(user)
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "asrin secret", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id); 
        res.locals.user = user; 
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

exports.checkUser= checkUser
exports.requireAuth = requireAuth
