const User = require("../models/User");
const Prediction = require("../models/Prediction");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const crypto = require("node:crypto");
const { Resend } = require("resend");
const bcrypt = require("bcrypt");

function createToken(id) {
  return jwt.sign({ id }, secret, { expiresIn: 21600 });
}

const handleErrors = (err) => {
  console.log(err.keyValue);
  if (err.code === 11000) {
    if (err.keyValue.email) return "Email is already registered.";
    else if (err.keyValue.username) return "Username is already registered.";
  }

  if (err.errors.email || err.errors.username || err.errors.password)
    return "Email, First Name, Last Name and Password are all required";
};

// Get Requests
module.exports.logout_get = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
  res.status(200).json({ message: "Logged Out" });
};

module.exports.me_get = async (req, res) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, secret, async (err, decodedToken) => {
      if (err) {
        res.json({ auth: false });
      } else {
        let user = await User.findById(decodedToken.id);
        if (!user) {
          res.json({ auth: false });
        } else {
          res.json({
            auth: true,
            user: user.email,
            hasPredicted: user.hasPredicted,
          });
        }
      }
    });
  } else {
    res.json({ auth: false });
  }
};

module.exports.predictions_get = async (req, res) => {
  const predPage = req.query.predPage || 0;
  const predLimit = 20;
  const predSkip = predPage * predLimit;
  try {
    const preds = await Prediction.find({})
      .populate("user", "firstName lastName")
      .sort({ createdAt: 1 })
      .skip(predSkip)
      .limit(predLimit);

    res.status(200).json({
      preds,
      page: predPage,
      hasNextPage: preds.length === predLimit,
    });
  } catch (error) {
    console.log(error);
  }
};

// Post Requests
module.exports.forgotPassword_post = async (req, res) => {
  const { email } = req.body;

  try {
    const buffer = crypto.randomBytes(32);
    const code = buffer.toString("hex");
    const user = await User.passReset(email, code);
    if (!user) return res.sendStatus(200);
    const resend = new Resend(process.env.RESEND_API_KEY);
    const frontEnd = process.env.FRONTEND_URL;
    const resetUrl = `${frontEnd}/reset-password/${user._id}/${code}`;
    const { data, error } = await resend.emails.send({
      from: "noreply@resend.dev",
      to: [email],
      subject: "Reset Password",
      html: `<p>Click the following link to reset your password. <br> ${resetUrl} <br> This link will expire in 15 minutes.</p>`,
    });
    if (error) throw new Error(error.message);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 21600 * 1000,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
    res.status(201).json({ user: user.email, hasPredicted: user.hasPredicted });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports.signup_post = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const newUser = await User.create({ email, password, firstName, lastName });
    const token = createToken(newUser._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 21600 * 1000,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
    res.status(201).json({ user: newUser.email });
  } catch (error) {
    const err = handleErrors(error);
    console.log(err);
    res.status(400).json({ error: err });
  }
};

module.exports.predict_post = async (req, res) => {
  const { gender, date, height, pounds, ounces } = req.body;
  const token = req.cookies.jwt;
  const user = jwt.verify(token, secret).id;

  try {
    const newPrediction = await Prediction.create({
      user,
      gender,
      date,
      height,
      pounds,
      ounces,
    });
    await User.findByIdAndUpdate(user, { hasPredicted: true });
    res.status(201).json({ message: "Prediction made" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports.reset_post = async (req, res) => {
  const { id, token, password } = req.body;

  try {
    const user = await User.findById(id);
    if (user) {
      const auth = await bcrypt.compare(token, user.resetTokenHash);
      const currDate = new Date(Date.now());
      if (auth && currDate < user.resetTokenExpire) {
        user.password = password;
        user.resetTokenExpire = null;
        user.resetTokenHash = null;
        await user.save();
        res.sendStatus(200);
      } else res.sendStatus(400);
    } else res.sendStatus(400);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.verify_reset_token_post = async (req, res) => {
  const { id, token } = req.body;
  try {
    const user = await User.findById(id);
    if (user) {
      const auth = await bcrypt.compare(token, user.resetTokenHash);
      const currDate = new Date(Date.now());
      if (auth && currDate < user.resetTokenExpire) res.sendStatus(200);
      else res.sendStatus(400);
    } else res.sendStatus(400);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.predict_patch = async (req, res) => {
  const { gender, date, height, pounds, ounces } = req.body;
  const token = req.cookies.jwt;
  const user = jwt.verify(token, secret).id;
  console.log(user);

  try {
    await Prediction.findOneAndUpdate(
      { user: user },
      {
        gender,
        date,
        height,
        pounds,
        ounces,
      },
    );

    res.status(201).json({ message: "Prediction updated" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
