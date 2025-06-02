import jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import { User } from "../models/userModel.js";

export const isAuthenticated = catchAsyncError(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        throw new ErrorHandler("User is not authenticated",400);
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    // console.log(decoded)
    req.user = await User.findById(decoded.id);
    next();


})


export const isAuthorized = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            throw new ErrorHandler(`User with this ${req.user.role} role is not allowed`,400);
        }
        next();
    }
}