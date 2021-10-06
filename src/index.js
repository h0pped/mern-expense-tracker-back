const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const auth = require("./middlewares/auth");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// DB
require("./db/mongoose");

//Routes
const userRouter = require("./routes/UserRoutes");
const cashCardRouter = require("./routes/CashCardRoutes");
const transactionsRouter = require("./routes/TransactionsRoutes");

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use((req, res, next) => {
  if (req.cookies["authToken"]) {
    const authToken = req.cookies["authToken"];
    req.token = authToken;
  } else if (req.headers["authorization"]) {
    const authToken = req.headers["authorization"];
    req.token = authToken;
  }
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
