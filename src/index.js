const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const auth = require("./middlewares/auth");
const UserModel = require("./models/UserModel");
const CashCardModel = require("./models/CashCardModel");
const TransactionModel = require("./models/TransactionModel");
const cookieParser = require("cookie-parser");
// DB
require("./db/mongoose");

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  const authToken = req.cookies["authToken"];
  req.token = authToken;
  next();
});

app.get("/", (req, res) => {
  res.send({ message: "Hello, world!" });
});
app.get("/anime", auth, (req, res) => {
  res.send(req.user);
});

app.post("/signup", async (req, res) => {
  try {
    const user = new UserModel(req.body);
    const defaultCard = new CashCardModel({
      owner: user._id,
    });
    await user.save();
    await defaultCard.save();
    const token = await user.generateAuthToken();
    res.cookie("authToken", token);
    return res.status(201).send({ user, token });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).send({ err: "Email is already used" });
    }
    return res.status(500).send({ err });
  }
});
app.post("/signin", async (req, res) => {
  try {
    const user = await UserModel.findByCredentials(
      req.body.email,
      req.body.password
    );
    if (user) {
      const token = await user.generateAuthToken();
      res.cookie("authToken", token);
      return res.send({ user, token });
    }
  } catch (err) {
    res.status(500).send({ err: err });
  }
});
app.get("/cards", auth, async (req, res) => {
  try {
    cards = await CashCardModel.find({
      owner: req.user._id,
    });
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
// Add new transaction to the card
app.post("/transactions/:id", auth, async (req, res) => {
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
// Get transactions of the card
app.get("/card/:id/transactions/", auth, async (req, res) => {
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
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
