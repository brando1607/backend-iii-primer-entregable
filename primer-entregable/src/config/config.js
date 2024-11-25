import { env } from "../utils/env.utils.js";

export const config = {
  PORT: env.PORT,
  MONGO_URI: env.MONGO_URI,
  NODEMAILER_PASSWORD: env.NODEMAILER_PASSWORD,
};
