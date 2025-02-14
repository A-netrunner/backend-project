import asynchandler from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadImage } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/Apiresponse.js";

import { response } from "express";

const registerUser = asynchandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  let avatarLocalPath;
  if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required!");
  }

  const avatar = await uploadImage(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar image");
  }

  let coverImage;
  if (coverImageLocalPath) {
    coverImage = await uploadImage(coverImageLocalPath);
    if (!coverImage) {
      throw new ApiError(400, "Failed to upload cover image");
    }
  }

  const user = await User.create({
    fullName,
    coverImage: coverImage || "", // Use empty string if coverImage is not provided
    email,
    avatar,
    password,
    username: username.toLowerCase(),
  });

  const checkUser = await User.findById(user._id).select("-password -refreshToken");

  if (!checkUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res.status(201).json(new ApiResponse(200, checkUser, "User registration completed"));
});


export { registerUser };
