const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const auth = async (req, res, next) => {
  try {
    if (req.token) {
      const decoded = jwt.verify(req.token, process.env.JWT_SECRET);
      const user = UserModel.findOne({
        _id: decoded._id,
        "tokens.token": req.token,
      });
      if (!user) {
        throw new Error("No user was found with that token");
      }
      req.user = user;
      next();
    } else {
      throw new Error("You should be logged in");
    }
  } catch (err) {
    res.redirect("/signin");
  }
};
module.exports = auth;
