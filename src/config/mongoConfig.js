import mongoose from "mongoose";
import { env } from "../utils/env.utils.js";
export function dbConnection() {
  mongoose
    .connect(env.MONGO_URI)
    .then(() => console.log("DB connected"))
    .catch((error) => console.log({ error: error.message }));
}
