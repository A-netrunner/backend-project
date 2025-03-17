import asynchandler from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadImage } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/Apiresponse.js";

const generateAccessANDREfreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken;
    const refreshToken = user.generateRefreshToken;

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(
      500,
      " something wrong with token while generating refresh token and access token!"
    );
  }
};
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
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  let avatarLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
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

  const checkUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!checkUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, checkUser, "User registration completed"));
});

//login user

const LoginUser = asynchandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!username || !email || !password) {
    throw new ApiError(401, "username or email or password is required ");
  }

  const findUser = await User.findOne({
    $or: [{ username }, { email }, { password }],
  });
  if (!findUser) {
    throw new ApiError(404, "user not found!");
  }

  const isPasswordValid = await findUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, " invalid credintials");
  }

  const { accessToken, refreshToken } = await generateAccessANDREfreshToken(
    User._id
  );

  const loggedINuser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken: ", accessToken, options)
    .cookie("refreshToken: ", refreshToken)
    .json(
      new ApiResponse(
        200,
        { user: loggedINuser, accessToken, refreshToken },
        "user logged in successfully"
      )
    );
});

const LogoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user_id, {
    $set: {
      refreshToken: undefined,
    },
    new: true,
  })
  const options = {
    httpOnly: true,
    secure: true,
  }
  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"user logged out"))
});

export { registerUser, LoginUser, LogoutUser };
