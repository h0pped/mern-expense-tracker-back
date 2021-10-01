"use strict";

var express = require("express");

var app = express();
var port = process.env.PORT || 5000;

var auth = require("./middlewares/auth");

var UserModel = require("./models/UserModel");

var CashCardModel = require("./models/CashCardModel");

var cookieParser = require("cookie-parser"); // DB


require("./db/mongoose");

app.use(express.json());
app.use(cookieParser());
app.use(function (req, res, next) {
  var authToken = req.cookies["authToken"];
  req.token = authToken;
  next();
});
app.get("/", function (req, res) {
  res.send({
    message: "Hello, world!"
  });
});
app.get("/anime", auth, function (req, res) {
  res.send(req.user);
});
app.post("/signup", function _callee(req, res) {
  var user, defaultCard, token;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          user = new UserModel(req.body);
          defaultCard = new CashCardModel({
            owner: user._id
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(user.save());

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(defaultCard.save());

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(user.generateAuthToken());

        case 9:
          token = _context.sent;
          res.cookie("authToken", token);
          return _context.abrupt("return", res.status(201).send({
            user: user,
            token: token
          }));

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

          if (!(_context.t0.code === 11000)) {
            _context.next = 19;
            break;
          }

          return _context.abrupt("return", res.status(400).send({
            err: "Email is already used"
          }));

        case 19:
          return _context.abrupt("return", res.status(500).send({
            err: _context.t0
          }));

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
app.post("/signin", function _callee2(req, res) {
  var user, token;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(UserModel.findByCredentials(req.body.email, req.body.password));

        case 3:
          user = _context2.sent;

          if (!user) {
            _context2.next = 10;
            break;
          }

          _context2.next = 7;
          return regeneratorRuntime.awrap(user.generateAuthToken());

        case 7:
          token = _context2.sent;
          res.cookie("authToken", token);
          return _context2.abrupt("return", res.send({
            user: user,
            token: token
          }));

        case 10:
          _context2.next = 15;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          res.status(500).send({
            err: _context2.t0
          });

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
app.get("/cards", auth, function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(CashCardModel.find({
            owner: req.user._id
          }));

        case 3:
          cards = _context3.sent;

          if (cards) {
            res.send(cards);
          } else {
            res.status(404).send({
              err: "No cards found"
            });
          }

          _context3.next = 11;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          res.status(500).send({
            err: _context3.t0
          });

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
app.listen(port, function () {
  console.log("Listening on ".concat(port));
});