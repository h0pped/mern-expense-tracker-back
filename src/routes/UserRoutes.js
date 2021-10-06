const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const UserModel = require("../models/UserModel");
const CashCardModel = require("../models/CashCardModel");
router.post("/signup", async (req, res) => {
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
router.post("/signin", async (req, res) => {
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
    res.status(500).send({ err: err.message });
  }
});

router.get("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((el) => el.token !== req.token);
    await req.user.save();
    res.clearCookie("authToken");
    res.send();
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
