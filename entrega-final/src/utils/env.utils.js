import { config } from "dotenv";
import { argsConfig } from "./args.utils.js";

const { m } = argsConfig;
const path = "./.env." + m;
config({ path });

export const env = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  NODEMAILER_HOST: process.env.NODEMAILER_HOST,
  NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
  NODEMAILER_PORT: process.env.NODEMAILER_PORT,
  NODEMAILER_USER: process.env.NODEMAILER_USER,
};
