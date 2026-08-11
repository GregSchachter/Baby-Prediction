const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  resetTokenHash: {
    type: String,
  },
  resetTokenExpire: {
    type: Date,
  },
  hasPredicted: {
    type: Boolean,
  },
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("Incorrect email or password");
  }
  throw Error("Incorrect email or password");
};

userSchema.statics.passReset = async function (email, code) {
  const salt = await bcrypt.genSalt();
  const hashedCode = await bcrypt.hash(code, salt);
  const expireDate = new Date(Date.now() + 15 * 60 * 1000);
  const user = await this.findOneAndUpdate(
    { email },
    { resetTokenHash: hashedCode, resetTokenExpire: expireDate },
  );
  return user;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
