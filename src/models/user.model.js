import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    avatar: {
      type: String,
    },

    coverImage: {
      type: String,
    },

    watchHistory: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  // Corrected the method name to isModified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName, // Corrected to fullName
    },
    process.env.ACCESS_TOKEN_SECRET, // Ensure this is the correct environment variable name
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
    }
  );
};

export const User = mongoose.model("User", UserSchema);
