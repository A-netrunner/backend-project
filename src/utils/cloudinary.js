import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: "dj0l67xs6",
  api_key: "474646853655316",
  api_secret: "",
});

const uploadImage = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("Image uploaded successfully", response.url);

    return response.url;
  } catch (error) {
    console.error("error uploading image:-", error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    //remove the local saved temp file after upload got failed

    return null;
  }
};
export { uploadImage };
