import nodemailer from "nodemailer";

//handler
import { HandRepositoriesAsync } from "../utils/handlers/handlerAsync.js";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "smtp.gmail.com",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const mailer = HandRepositoriesAsync(async (to, subject, html) => {
  const info = await transporter.sendMail({
    from: `Zipy ${process.env.EMAIL_USER}`,
    to,
    subject,
    html,
  });
  console.log("Email sent:", info.response);
  return info;
});
