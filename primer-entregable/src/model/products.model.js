import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  stock: {
    type: Number,
    require: true,
  },
  seller: { type: String, required: true },
});

export const productModel = mongoose.model("product", productsSchema);
