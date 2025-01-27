import asynchandler from "../utils/asynchandler.js";
import apiError from "../utils/ApiError.js";
import { user } from "../models/user.model.js";
import {uploadImage} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/Apiresponse.js"
import { response } from "express";



const registerUser = asynchandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  console.log("email:", email);

  // if(fullName == ""){
  //   throw new apiError(400, " full name is req")
  // }

  if (
    [fullName, email, username, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new apiError(400, " all fields are required");
  }

 const existedUser =  user.findOne({
    $or: [{ username }, { email }],
  })

  if(existedUser){
    throw new ApiError(409, " user with eamil already exist")
  }
const avatarLocalPath = req.files?.avatar[0]?.path;

const coverImage = req.files?.coverImage[0]?.path;

if(!avatarLocalPath)
{
  throw new apiError(400,"avatar is required!")
  
}

 const avatar =  await uploadImage(avatarLocalPath)
const coverimage = await uploadImage(coverImage)

if(!avatar){
  throw new apiError(400,"avatar is req")
}

const user = await user.create({
  fullName,
  avatar: avatar.url,
  coverImage: coverImage?.url || "",
  email,
  password,
  username:username.toLowerCase()
})

const checkUser = await user.findById(user._id).select(
  "-password -refreshToken"
)

if(!checkUser){
  throw new apiError(500,"something went wrong while register user")
}


return res.status(201).json(
  new ApiResponse(200,checkUser, "user registed completed ")
)










});

export { registerUser };
