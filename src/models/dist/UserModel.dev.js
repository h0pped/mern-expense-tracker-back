"use strict";

var mongoose = require("mongoose");

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var UserSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  surname: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true
  },
  username: {
    type: String
  },
  password: {
    type: String,
    trim: true
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});
UserSchema.virtual("cards", {
  ref: "CashCard",
  localField: "_id",
  foreignField: "owner"
});

UserSchema.statics.findByCredentials = function _callee(email, password) {
  var user, isMatch;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(UserModel.findOne({
            email: email
          }));

        case 2:
          user = _context.sent;

          if (user) {
            _context.next = 5;
            break;
          }

          throw new Error("Unable to login!");

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 7:
          isMatch = _context.sent;

          if (isMatch) {
            _context.next = 10;
            break;
          }

          throw new Error("Unable to login!");

        case 10:
          return _context.abrupt("return", user);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
};

UserSchema.methods.generateAuthToken = function _callee2() {
  var user, token;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          user = this;
          console.log(process.env.JWT_SECRET);
          token = jwt.sign({
            _id: user._id
          }, process.env.JWT_SECRET);
          user.tokens.push({
            token: token
          });
          _context2.next = 6;
          return regeneratorRuntime.awrap(user.save());

        case 6:
          return _context2.abrupt("return", token);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
};

UserSchema.methods.deleteToken = function _callee3(token) {
  var user;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          user = this;
          user.tokens = user.tokens.filter(function (el) {
            return el.token !== token;
          });
          _context3.next = 4;
          return regeneratorRuntime.awrap(user.save());

        case 4:
          return _context3.abrupt("return", token);

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  }, null, this);
};

UserSchema.pre("save", function _callee4(next) {
  var user;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          user = this;

          if (!user.isModified("password")) {
            _context4.next = 5;
            break;
          }

          _context4.next = 4;
          return regeneratorRuntime.awrap(bcrypt.hash(user.password, 8));

        case 4:
          user.password = _context4.sent;

        case 5:
          next();

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  }, null, this);
});
var UserModel = new mongoose.model("User", UserSchema);
module.exports = UserModel;