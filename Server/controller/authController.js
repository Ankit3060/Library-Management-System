import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import {User} from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerifiacationcode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";

export const register = catchAsyncError(async(req,res,next)=>{

    //first take the user input
    // then if user forget to fill some field then show error message
    // check that email is unique from database
    // Check the number of attempt user make for the creation of account
    // Hash the password
    // make a new record to the user in DB
    // Generate the verification code OTP
    // Save the user in DB
    // Match the verification code

    try {
        const {name, email, password} = req.body;

        if(!name || !password || !email){
            throw new ErrorHandler("Please enter the required field",400);
        }


        // Checking user is registered or not
        const isUserRegistered = await User.findOne({email,accountVerified:true});
        if(isUserRegistered){
            throw new ErrorHandler("User already exists",400);
        }


        // Checking the number of attempt made by the user
        const registerationAttemptByUser = await User.find({
            email,
            accountVerified : false,
        })
        if(registerationAttemptByUser.length>=5){
            throw new ErrorHandler("You have exceed the number of attempts. Please contact support",400)
        }


        // Checking the password length and hashing it 
        if(password.length<8 || password.length>16){
            throw new ErrorHandler("Password length must be between 8 to 16 character",400)
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
});


export const verifyOTP = catchAsyncError(async(req,res,next)=>{
    const {email,otp} = req.body;
    if(!email && !otp){
        throw new ErrorHandler("Email and otp is required",400)
    }

    try {
        const userAllEntries = await User.find({
            email,
            accountVerified : false,
        }).sort({createdAt : -1})
        if(!userAllEntries){
            throw new ErrorHandler("User not found ",404);
        }

        // If user has many entries in DB delete all previous one and keep latest
        let user;
        if(userAllEntries.length>1){
            user = userAllEntries[0];
            await User.deleteMany({
                _id : {$ne : user._id},
                email,
                accountVerified : false
            })
        }else{
            user = userAllEntries[0];
        }

        // Here we are checking the otp is same or not
        if(user.verificationCode !== Number(otp)){
            throw new ErrorHandler("Invalid OTP",400)
        }

        // Here we are checking the otp is expired or not 
        // with the help of time the otp generated and current time
        // If time crosses the 15MIn that we used in User controller then it htrow error
        const currentTime = Date.now();

        const verificationCodeExpire = new Date(
            user.verificationCodeExpire
        ).getTime();


        if(currentTime > verificationCodeExpire){
            throw new ErrorHandler("OTP Expired",400)
        }

        // After the user otp verification all the below data are updated in DB
        user.accountVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpire = null;

        // Here we are updating the modified data in user
        await user.save({validateModifiedOnly : true});

        // login the user and send the token
        sendToken(user,200,"Account Verified",res);

    } catch (error) {
        throw new ErrorHandler("Internal server error",500)
    }
})

