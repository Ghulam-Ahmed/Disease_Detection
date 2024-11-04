const router = require("express").Router();
const User = require("../db/schema");
const bcrypt = require("bcrypt");
const Token = require("../db/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

router.post("/", async (request, respond) => {
  try {
    const { email, password, ...otherDetails } = request.body;

    if (!email || !password) {
      return respond
        .status(400)
        .send({ error: "Email and password are required." });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return respond
        .status(409)
        .send({ error: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let user = new User({
      ...otherDetails,
      email,
      password: hashedPassword,
    });

    let result = await user.save();

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `${process.env.BASE_URL}register/${user._id}/verify/${token.token}`;
    await sendEmail(
      user.email,
      "Verify Your Email Address with DiagnoTechHub",
      `\nDear User,\n\nThank you for registering with DiagnotechHub\nTo complete your registration, we need to verify your email address. Please click the link below to confirm your email:\n\n${url}\n\nBest regards,\nThe DiagnotechHub Team`
    );

    result = result.toObject();
    delete result.password;

    respond.status(201).send({
      message:
        "Registration successful. A verification email has been sent to your account.",
    });
  } catch (error) {
    console.error("Error during registration:", error);
    respond
      .status(500)
      .send({ error: "An error occurred while registering the user." });
  }
});

// Email Verification
router.get("/:id/verify/:token", async (req, res) => {
  try {
    const { id, token } = req.params;

    const user = await User.findOne({ _id: id });
    if (!user || user.verified) {
      return res
        .status(400)
        .send({ message: "Invalid or expired verification link." });
    }

    const tokenDoc = await Token.findOne({ userId: user._id, token });
    if (!tokenDoc) {
      return res
        .status(400)
        .send({ message: "Invalid or expired verification link." });
    }

    await User.updateOne({ _id: user._id }, { verified: true });
    await tokenDoc.remove();

    res.status(200).send({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
