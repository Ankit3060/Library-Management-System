import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import crypto from "crypto"

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


// Here we are creating the verification code OTP
userSchema.methods.generateVerifiactionCode = function(){
    function generateRandomFiveDigitNumber(){
        const firstDigit = Math.floor(Math.random()*9)+1;
        const remainingDigit = Math.floor(Math.random()*10000).toString().padStart(4,0);
        return parseInt(firstDigit+remainingDigit);
    }

    const verificationCode = generateRandomFiveDigitNumber();
    this.verificationCode = verificationCode;
    this.verificationCodeExpire = Date.now()+15*60*1000;

    return verificationCode;
}

// Here we are generating the token
userSchema.methods.generateToken = function(){
    return jwt.sign(
        {id : this._id,},
        process.env.JWT_SECRET_KEY,
        {expiresIn : process.env.JWT_EXPIRE}
    )
}


// Here we are generating the reset Password Token
userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
                                    .createHash("sha256").
                                    update(resetToken).
                                    digest("hex");

    this.resetPasswordExpire = Date.now() +15*60*1000;
    return resetToken;
}
export const User = mongoose.model("User",userSchema);