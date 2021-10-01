const express = require("express");
const router = express.Router();

// MIDDLEWARES
const auth = require("../middlewares/auth");

// MODELS
const CashCardModel = require("../models/CashCardModel");
const TransactionModel = require("../models/TransactionModel");

// GET: USER CARDS
router.get("/cards", auth, async (req, res) => {
  try {
    cards = await CashCardModel.find({
      owner: req.user._id,
    });
    console.log("CARDS", cards);
    if (cards) {
      res.send(cards);
    } else {
      res.status(404).send({ err: "No cards found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err });
  }
});

//POST: ADD NEW CARD
router.post("/cards", auth, async (req, res) => {
  try {
    const card = new CashCardModel({
      ...req.body,
      owner: req.user,
    });
    await card.save();
    res.status(201).send(card);
  } catch (err) {
    res.status(500).send({ err: err.message });
  }
});
// GET: ALL TRANSACTIONS BY CARD ID
router.get("/card/:id/transactions/", auth, async (req, res) => {
  const transactions = await TransactionModel.find({
    card: req.params.id,
    owner: req.user._id,
  });
  if (transactions) {
    res.send(transactions);
  } else {
    res.status(404).send({ err: "Transactions not found" });
  }
});

module.exports = router;
