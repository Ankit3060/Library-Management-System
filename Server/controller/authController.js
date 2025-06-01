import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import {User} from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerifiacationcode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateForgetPasswordEmailTemplate } from "../utils/emailTemplate.js";

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


export const login = catchAsyncError(async(req,res,next)=>{
    // take user login credential like mail and password
    // check the user enter the mail and password or not
    // check the mail is available in our database or not
    // check the password match or not
    // create the token and make user login

    const {email, password} = req.body;
    if(!email || !password){
        throw new ErrorHandler("Please enter all the field",400);
    }

    // check user exist or not
    const isValidUser = await User.findOne({email,accountVerified:true}).select("+password");
    if(!isValidUser){
        throw new ErrorHandler("Invalid userid or password ",400);
    }

    // Match the password
    const isPasswordCorrect = await bcrypt.compare(password,isValidUser.password);
    if(!isPasswordCorrect){
        throw new ErrorHandler("Invalid userid or password ",400);
    }

    // send the token
    sendToken(isValidUser,200,"User login successfully",res);

})


export const logout = catchAsyncError(async(req,res,next)=>{
    // delete the cookie
    res.status(200).cookie("token","",{
        expires : new Date(Date.now()),
        httpOnly : true
    }).json({
        success : true,
        message : "logout successfully"
    })
})


export const getUser = catchAsyncError(async(req,res,next)=>{
    const user = req.user;

    res.status(200).json({
        success : true,
        user
    })
})


export const forgetPassword = catchAsyncError(async(req,res,next)=>{
    if(!req.body.email){
        throw new ErrorHandler("Email is required ",400)
    }

    const user = await User.findOne({
        email : req.body.email,
        accountVerified : true
    })

    if(!user){
        throw new ErrorHandler("Invalid email",400);
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave : false});

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = generateForgetPasswordEmailTemplate(resetPasswordUrl);

    try {
        await sendEmail({
            email : user.email,
            subject : "Bookworm Library Management System Recovery Password",
            message,
        })
        res.status(200).json({
            success : true,
            message : `Email sent to the ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave : false});

        throw new ErrorHandler(error.message,500);
    }
})


export const resetPassword = catchAsyncError(async(req,res,next)=>{
    // get the token 
    // console.log("working till here")
    const {token} = req.params;
    const resetPasswordToken = crypto
                               .createHash("sha256")
                               .update(token)
                               .digest("hex");
    
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()}
    })
    if(!user){
        throw new ErrorHandler("Reset passsword token is invalid or expired",400);
    }

    if(req.body.password != req.body.confirmPassword){
        throw new ErrorHandler("Password and confirmed password do not match",400);
    }

    if( req.body.password.length<8 || 
        req.body.password.length>16 || 
        req.body.confirmPassword.length<8 || 
        req.body.confirmPassword.length>16){
            throw new ErrorHandler("Password must be between 8 and 16 character",400);
    }

    //now hash the password
    const hashPassword = await bcrypt.hash(req.body.password,10);

    //update the password and token also
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // now save the user
    await user.save();

    // send the token to the user
    sendToken(user,200,"Password reset successful",res);

})


export const updatePassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user._id).select("+password");
    // console.log("working til here");
    
    const {currentPassword, newPassword, confirmNewPassword} = req.body;

    if(!currentPassword || !newPassword || !confirmNewPassword){
        throw new ErrorHandler("Please enter all field",400);
    }

    const checkCurrentPassword = await bcrypt.compare(currentPassword,user.password);
    if(!checkCurrentPassword){
        throw new ErrorHandler("currrent password is incorrect",400);
    }
    
    if( newPassword.length<8 || 
        newPassword.length>16 || 
        confirmNewPassword.length<8 || 
        confirmNewPassword.length>16){
            throw new ErrorHandler("Password must be between 8 and 16 character",400);
    }

    if(newPassword != confirmNewPassword){
        throw new ErrorHandler("new password and confirm password donot match",400);
    }

    const hashedPassword = await bcrypt.hash(newPassword,10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
        success : true,
        message : "password update successful"
    })
})