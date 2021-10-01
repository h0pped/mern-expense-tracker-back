"use strict";

var mongoose = require("mongoose");

var TransactionSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    "default": "New Transaction"
  },
  amount: {
    type: Number,
    required: true
  },
  card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CashCard"
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

function isMatchOwners(transaction) {
  return regeneratorRuntime.async(function isMatchOwners$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(transaction.populate("card").execPopulate());

        case 2:
          if (!transaction.card.owner.equals(transaction.owner)) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", true);

        case 6:
          return _context.abrupt("return", false);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}

TaskListSchema.pre("save", function _callee(next) {
  var task;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          task = this;
          _context2.next = 3;
          return regeneratorRuntime.awrap(isMatchOwners(task));

        case 3:
          if (!_context2.sent) {
            _context2.next = 7;
            break;
          }

          next();
          _context2.next = 8;
          break;

        case 7:
          throw new Error("You are not the owner of the Card");

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
});
var TransactionModel = new mongoose.model("Transaction", TransactionSchema);
module.exports = TransactionModel;