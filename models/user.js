const { date } = require("joi");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      unique: true,
    },
    password: { type: String, required: true, minlength: 3, maxlength: 1024 },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: date.now }
);



const User = mongoose.model("User", userSchema);

exports.User = User;
