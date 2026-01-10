const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Create Transport
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendMail(email, message, title) {
  try {
    transporter.sendMail({
      subject: title,
      from: process.env.MAIL_USER,
      to: email,
      text: message,
      html: `<h1>${message}</h1>`,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
}

module.exports = { sendMail };
