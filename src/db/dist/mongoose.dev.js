"use strict";

var mongoose = require("mongoose");

var chalk = require("chalk");

mongoose
  .connect(process.env.MONGODB_URL)
  .then(function () {
    console.log("Connection to db: ".concat(chalk.green("Success!")));
  })
  ["catch"](function (err) {
    console.log("Connection to db: ".concat(chalk.red("Error!")));
    console.log(err);
  });
