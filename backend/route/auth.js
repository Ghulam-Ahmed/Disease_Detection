const router = require("express").Router();
const schema = require("../db/schema");
const Token = require("../db/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

router.post("/", async (request, response) => {
  try {
    const { email, password } = request.body;

    // Validate input
    if (!email || !password) {
      return response.status(400).send({ result: "Invalid Input: Email and password are required." });
    }

    // Find user and exclude password
    let user = await schema.findOne({ email }).select("-password");

    if (!user) {
      return response.status(404).send({ result: "No User Found." });
    }

    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });

      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}users/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", url);
      }

      return response.status(400).send({
        message: "An email has been sent to your account. Please verify your email.",
      });
    }

    // Return only necessary user information
    return response.status(200).send({
      email: user.email,
      name: user.name,
      verified: user.verified,
    });

  } catch (error) {
    console.error("Error in / POST:", error);
    response.status(500).send({ error: "An error occurred while processing your request." });
  }
});

module.exports = router;
