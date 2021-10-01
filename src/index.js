const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const auth = require("./middlewares/auth");
const cookieParser = require("cookie-parser");

// DB
require("./db/mongoose");

//Routes
const userRouter = require("./routes/UserRoutes");
const cashCardRouter = require("./routes/CashCardRoutes");
const transactionsRouter = require("./routes/TransactionsRoutes");

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  const authToken = req.cookies["authToken"];
  req.token = authToken;
  next();
});

app.use(userRouter);
app.use(cashCardRouter);
app.use(transactionsRouter);

app.get("/", (req, res) => {
  res.send({ message: "Hello, world!" });
});

app.get("/anime", auth, (req, res) => {
  res.send(req.user);
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
