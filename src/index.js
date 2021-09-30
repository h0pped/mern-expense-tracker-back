const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// DB
require("./db/mongoose");

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "hello, world!" });
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
