import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



const UserSchema = new Schema({
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

    fullname: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
    },

    avatar: {
        type: String,
        required: true,
      
    },

    coverimg: {
        type: String,
        
    },

    watchHistory:{
        type:Schema.types.ObjectId,
        ref:"Video"

    },

    password:{
         type:String,
         required:[true,"Password is required"],   
    },

    refreshToken:{
        type:String,
    },

    timestaps:true,
})

UserSchema.pre("save",async function (next)
{
    if(!this.ismodifed("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next()
})

export default mongoose.model("User", UserSchema);