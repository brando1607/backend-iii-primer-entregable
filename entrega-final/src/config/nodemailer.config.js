import nodemailer from "nodemailer";
import { env } from "../utils/env.utils.js";

export const sendEmail = async (email, text) => {
  const transporter = nodemailer.createTransport({
    host: env.NODEMAILER_HOST,
    port: env.NODEMAILER_PORT,
    auth: {
      user: env.NODEMAILER_USER,
      pass: env.NODEMAILER_PASSWORD,
    },
  });

  const mailSettings = {
    from: "test@gmail.com",
    to: email,
    subject: "Invoice",
    html: text,
  };

  try {
    await transporter.sendMail(mailSettings);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
