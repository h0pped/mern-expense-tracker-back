"use strict";

var express = require("express");

var app = express();
var port = process.env.PORT || 3000; // DB

require("./db/mongoose");

app.use(express.json());
app.get("/", function (req, res) {
  res.send({
    message: "hello, world!"
  });
});
app.listen(port, function () {
  console.log("Listening on ".concat(port));
});