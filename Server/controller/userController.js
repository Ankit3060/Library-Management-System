import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userModel.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";


export const getAllUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.find({accountVerified : true});
    res.status(200).json({
        success : true,
        user,
    });
});


export const registerNewAdmin = catchAsyncError(async(req,res,next)=>{
    if(!req.files || Object.keys(req.files).length===0){
        throw new ErrorHandler("Admin avatar is required",400);
    }

    const {name, email, password} = req.body;
    if(!name || !email || !password){
        throw new ErrorHandler("All fields are required",400);
    }

    const isAlreadyRegister = await User.findOne({email,accountVerified : true});
    if(isAlreadyRegister){
        throw new ErrorHandler("user already registered",400);
    }

    if(password.length<8 || password.length>16){
        throw new ErrorHandler("Password must be between 8 to 16 character",400);
    }

    const {avatar} =  req.files;

    const allowedFormat = ["image/png","image/jpeg","image/webp","image/jpg"];
    if(!allowedFormat.includes(avatar.mimetype)){
        throw new ErrorHandler("File format not supported",400);
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath, {
            folder : "Librar_Management_System_Admin_Avatar"
        }
    );
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("cloudinary error",cloudinaryResponse.error || "Unknown cloudinary error");
        throw new ErrorHandler("Failed to upload avatar to cloudinary",400);
    }

    const admin = await User.create({
        name,
        email,
        password : hashedPassword,
        role : "Admin",
        accountVerified : true,
        avatar : {
            public_id : cloudinaryResponse.public_id,
            url : cloudinaryResponse.secure_url
        }
    });


    res.status(200).json({
        success : true,
        message : "Admin register successfully",
        admin
    })


})