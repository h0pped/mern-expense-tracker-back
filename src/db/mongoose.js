const mongoose = require("mongoose");
const chalk = require("chalk");

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log(`Connection to db: ${chalk.green("Success!")}`);
  })
  .catch((err) => {
    console.log(`Connection to db: ${chalk.red("Error!")}`);
    console.log(err);
  });
