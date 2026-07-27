const User = require("../models/User");
const Prediction = require("../models/Prediction");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

function createToken(id) {
  return jwt.sign({ id }, secret, { expiresIn: 21600 });
}

module.exports.logout_get = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged Out" });
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 21600 * 1000 });
    res.status(201).json({ user: user.email });
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
    res.cookie("jwt", token, { httpOnly: true, maxAge: 21600 * 1000 });
    res.status(201).json({ user: newUser.email });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports.predict_post = async (req, res) => {
  const { gender, date, height, weight } = req.body;
  const token = req.cookies.jwt;
  const user = jwt.verify(token, secret).id;

  try {
    const newPrediction = await Prediction.create({
      user,
      gender,
      date,
      height,
      weight,
    });
    res.status(201).json({ message: "Prediction made" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
