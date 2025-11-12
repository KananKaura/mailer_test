import nodemailer from "nodemailer";
import 'dotenv/config'; // dotenv automatically loads .env file

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { to, subject, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: "Recipient & message required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,      // your Gmail
        pass: process.env.GMAIL_PASS       // 16-char App Password
      },
    });

    await transporter.sendMail({
      from: `"Mailer" <${process.env.GMAIL_USER}>`,
      to,
      subject: subject || "Test Mail",
      html: `<p>${message}</p>`
    });

    res.status(200).json({ success: true, msg: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: error.message });
  }
}
