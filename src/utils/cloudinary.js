import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import ApiError from './ApiError.js';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage= async(filePath)=>{
    if(!filePath){
        throw new ApiError(400,"Please provide an image in cloudinary");
    }
    const image= await cloudinary.uploader.upload(filePath,{resource_type:"image"});
    fs.unlinkSync(filePath);
    return image.secure_url
}

export  {uploadImage};
