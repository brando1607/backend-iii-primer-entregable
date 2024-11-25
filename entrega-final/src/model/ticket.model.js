import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    products: [
      {
        type: String,
        require: true,
      },
    ],
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: { createdAt: "purchase_datetime", updatedAt: false } }
);

export const ticketModel = mongoose.model("ticket", ticketSchema);
