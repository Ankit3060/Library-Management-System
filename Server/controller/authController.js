import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import {User} from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const register = catchAsyncError(async(req,res,next)=>{

    //first take the user input
    // then if user forget to fill some field then show error message
    // check that email is unique from database
    // Check the number of attempt user make for the creation of account
    // Hash the password
    // make a new record to the user
    // send the response to the user

    try {
        const {name, email, password} = req.body;

        if(!name || !password || !email){
            // throw new ErrorHandler("Please enter the required field",400);
            return next(new ErrorHandler("Please enter the required field",400));
        }


        // Checking user is registered or not
        const isUserRegistered = await User.findOne({email,accountVerified:true});
        if(isUserRegistered){
            // throw new ErrorHandler("User already exists",400);
            return next(new ErrorHandler("User already exists",400));
        }


        // Checking the number of attempt made by the user
        const registerationAttemptByUser = await User.find({
            email,
            accountVerified : false,
        })
        if(registerationAttemptByUser){
            return next(new ErrorHandler("You have exceed the number of attempts. Please contact support",400));
        }


        // Checking the password length and hashing it 
        if(password.length<8 || password.length>16){
            return next(new ErrorHandler("Password length must be between 8 to 16 character",400))
        }
        const hashPassword = await bcrypt.hash(password,10);


        // Create the user database
        const user = await User.create({
            name,
            email,
            password : hashPassword,
        })

        // Generaing the verification code
        const verificationCode = await user.generateVerifiactionCode();

        // save the user in DB
        await user.save();

        sendVerifiacationcode(verificationCode, email, res);

    } catch (error) {
        next(error)
    }
})