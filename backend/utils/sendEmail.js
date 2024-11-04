const nodemailer = require("nodemailer");

const sendEmail = async (recipient, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.USER, // Your Gmail address
        pass: process.env.PASS, // Your Gmail password or app password
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: recipient,
      subject,
      text,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
