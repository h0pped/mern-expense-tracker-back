"use strict";

var jwt = require("jsonwebtoken");

var UserModel = require("../models/UserModel");

var auth = function auth(req, res, next) {
  var token, decoded, user;
  return regeneratorRuntime.async(function auth$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;

          if (!req.token) {
            _context.next = 14;
            break;
          }

          token = req.token;
          decoded = jwt.verify(token, process.env.JWT_SECRET);
          _context.next = 6;
          return regeneratorRuntime.awrap(UserModel.findOne({
            _id: decoded._id,
            "tokens.token": token
          }));

        case 6:
          user = _context.sent;

          if (user) {
            _context.next = 9;
            break;
          }

          throw new Error();

        case 9:
          req.token = token;
          req.user = user;
          next();
          _context.next = 15;
          break;

        case 14:
          throw new Error("You should be logged in");

        case 15:
          _context.next = 20;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](0);
          res.send(_context.t0);

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

module.exports = auth;