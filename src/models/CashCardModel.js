const mongoose = require("mongoose");

const CashCardSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: "Card",
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
CashCardSchema.virtual("transactions", {
  ref: "Transaction",
  localField: "_id",
  foreignField: "card",
});
const CashCardModel = new mongoose.model("CashCard", CashCardSchema);
module.exports = CashCardModel;
