const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      default: "New Transaction",
    },
    amount: {
      type: Number,
      required: true,
    },
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CashCard",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

async function isMatchOwners(transaction) {
  await transaction.populate("card");
  if (transaction.card.owner.equals(transaction.owner)) {
    return true;
  } else {
    return false;
  }
}
async function changeBalance(transaction) {
  await transaction.populate("card");
  transaction.card.balance += transaction.amount;
  try {
    await transaction.card.save();
  } catch (err) {
    throw new Error("Failed to change balance");
  }
}
TransactionSchema.pre("save", async function (next) {
  const transaction = this;
  if (await isMatchOwners(transaction)) {
    changeBalance(transaction);
    next();
  } else {
    throw new Error("You are not the owner of the Card");
  }
});

const TransactionModel = new mongoose.model("Transaction", TransactionSchema);

module.exports = TransactionModel;
