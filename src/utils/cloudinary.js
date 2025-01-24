import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: "dj0l67xs6",
  api_key: "474646853655316",
  api_secret: "<your_api_secret>",
});

const uploadImage = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    await cloudinary.uploader.upload(localFilePath, { resource_type: auto });

    console.log("Image uploaded successfully", response.url);

    return response.url;
  } catch (error) {
fs.unlinkSync(localFilePath); //remove the local saved temp file after upload got failed 

   return null;
  }
};
export { uploadImage };