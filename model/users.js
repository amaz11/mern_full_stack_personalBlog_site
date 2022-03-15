const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, required: true, unique: true },
  profession: { type: String },
  password: { type: String, required: true },
  conpassword: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  message: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      mobile: { type: Number, required: true, unique: true },
      message: { type: String, required: true },
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
// middelware for hash password before save method
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.conpassword = await bcrypt.hash(this.conpassword, 12);
  }
  next();
});
// token save
userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
      expiresIn: "1hr",
    });
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

userSchema.methods.addMessage = async function (name, email, mobile, message) {
  try {
    this.message = this.message.concat({ name, email, mobile, message });
    await this.save();
    return this.message;
  } catch (error) {
    console.log(error);
  }
};

const UsersModel = model("USER", userSchema);

module.exports = UsersModel;
