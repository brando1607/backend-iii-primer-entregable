import mongoose from "mongoose";
import { createHash } from "../utils/hashPassword.js";
import { cartModel } from "./cart.model.js";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user", enum: ["admin", "user"] },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "cart" },
});

//middlewares
userSchema.pre("save", function (next) {
  if (this.email.includes("@") && this.email.includes(".")) {
    return next();
  }

  next(new Error("Invalid email"));
});

userSchema.pre("save", async function (next) {
  const hashedPassword = await createHash(this.password);

  this.password = hashedPassword;

  next();
});

userSchema.pre("deleteOne", { document: true }, async function (next) {
  try {
    await cartModel.findByIdAndDelete(this.cart);
    next();
  } catch (error) {
    next(error);
  }
});

export const userModel = mongoose.model("user", userSchema);
