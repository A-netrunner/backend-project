import mongoose,{Schema} from "mongoose";

const VideoSchema = new Schema({
   
   videoFile:{
    type:String,
    required:true,
   },

   thumbNail:{
    type:String,
    required:true,
   },
   
   description:{
    type:String,
    required:true,
   },

   duration:{
    type:Number,
    required:true,
   },

   views:{
    type:Number,
    default:0,

   },
    
   isPublic:{
    type:Boolean,
    default:true,

   },

   owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
   }
    

},
{
    timestamps:true}
);

export const Video = mongoose.model("video", VideoSchema);