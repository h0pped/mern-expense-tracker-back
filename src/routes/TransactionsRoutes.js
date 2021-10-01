const express = require("express");
const router = express.Router();

// MIDDLEWARES
const auth = require("../middlewares/auth");

// MODELS
const TransactionModel = require("../models/TransactionModel");

// POST: ADD NEW TRANSACTION
router.post("/transactions/:id", auth, async (req, res) => {
  const transaction = new TransactionModel({
    ...req.body,
    owner: req.user._id,
    card: req.params.id,
  });
  try {
    await transaction.save();
    res.status(201).send(transaction);
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err });
  }
});

module.exports = router;
