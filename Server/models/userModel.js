import { lowerCase, trim } from "lodash";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true,
        trim : true,
    },
    email : {
        type : String,
        require : true,
        lowerCase : true,
    },
    password : {
        type : String,
        require : true,
        select : false,
    },
    role : {
        type : String,
        enum : ["Admin","User"],
        default: "User"
    },
    accountVerified : {
        type : Boolean,
        default : false
    },
    borrowBooks : [
        {
            bookId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Borrow"
            },
            returned : {
                type : Boolean,
                default : false
            },
            bookTitle : String,
            borrowDate : Date,
            dueDate : Date

        }
    ],
    avatar : {
        public_id : String,
        url : String
    },
    verificationCode : Number,
    verificationCodeExpire : Date,
    resetPasswordToken : String,
    resetPasswordExpire : Date,

},{timestamps:true});


export const User = mongoose.model("User",userSchema);