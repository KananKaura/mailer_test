import express from "express";
import nodemailer from "nodemailer";
import 'dotenv/config';
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// Static frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));
app.use(express.json());

// Mail API
app.post("/sendMail", async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    if (!to || !message) return res.status(400).json({ error: "Recipient & message required" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      },
    });

    await transporter.sendMail({
      from: `"Mailer" <${process.env.GMAIL_USER}>`,
      to,
      subject: subject || "Test Mail",
      html: `<p>${message}</p>`
    });

    res.status(200).json({ success: true, msg: "Email sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
