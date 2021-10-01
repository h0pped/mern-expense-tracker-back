const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const auth = async (req, res, next) => {
  try {
    if (req.token) {
      const token = req.token;

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findOne({
        _id: decoded._id,
        "tokens.token": token,
      });
      if (!user) {
        throw new Error();
      }
      req.token = token;
      req.user = user;
      next();
    } else {
      throw new Error("You should be logged in");
    }
  } catch (err) {
    res.send(err);
  }
};
module.exports = auth;
