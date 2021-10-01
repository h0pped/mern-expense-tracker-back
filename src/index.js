const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const auth = require("./middlewares/auth");
const UserModel = require("./models/UserModel");
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
    console.log(user);
    await user.save();
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

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
