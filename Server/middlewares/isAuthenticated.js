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