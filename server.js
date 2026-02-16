const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

/* ---------------- EMAIL SETUP ---------------- */

const transport = nodemailer.createTransport({
  service: "gmail",
  secure:false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post("/api/send", async function (req, res) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!"
      });
    }

    const mailOptions = {
      from:email,
      to: process.env.EMAIL_USER,
      subject: subject,
      html: `
        <h1>${name}</h1>
        <h3>Email: ${email}</h3>
        <p>Message:</p>
        <p>${message}</p>
      `
    };

    const mailBack = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Feedback Confirmation",
      html: `
        <h2>Thank you for your message ${name}</h2>
        <p>I will get back to you soon. Please follow up on your email.</p>
      `
    };

    await transport.sendMail(mailOptions);
    await transport.sendMail(mailBack);

    res.status(200).json({
      success: true,
      message: "Email sent successfully!"
    });

  } catch (error) {
    console.error("Email error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.listen(PORT,()=>{
  console.log(`Kelvin server running on port ${PORT}`);
});
