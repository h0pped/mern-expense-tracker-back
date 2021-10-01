"use strict";

var mongoose = require("mongoose");

var CashCardSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    "default": "Card"
  },
  balance: {
    type: Number,
    required: true,
    "default": 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
}, {
  timestamps: true
});
var CashCardModel = new mongoose.model("CashCard", CashCardSchema);
module.exports = CashCardModel;