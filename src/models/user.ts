import mongoose from "mongoose";

const userModal = new mongoose.Schema(
  {
    name: { required: [true, "Please enter the user name"], type: String },
    email: {
      required: [true, "Please enter the email address"],
      type: String,
      unique: true,
      trim: true,
    },
    password: { required: [true, "Please enter the password"], type: String },
  },
  { collection: "auth-user", timestamps: true, minimize: false }
);

const authUser = mongoose.model("Auth-User",userModal);

module.exports = authUser;