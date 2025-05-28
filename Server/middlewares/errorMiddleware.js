class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err,req,res,next)=>{
    err.message = err.message || "Internal server error";
    err.statusCode = err.statusCode || 500;

    if(err.code==11000){
        const statusCode = 400;
        const message = `Dublicate field value entered`;
        err = new ErrorHandler(message,statusCode);
    }

    if(err.name=="JsonWebTokenError"){
        const statusCode = 400;
        const message = `Json Web Token is invalid. try again`;
        err = new ErrorHandler(message,statusCode);
    }

    if(err.name === "TokenExpiredError"){
        const message = "Json web token is expired. Please try again";
        const statusCode = 400;
        err = new ErrorHandler(message,statusCode);
    }
    
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        const statusCode = 400;
        err = new ErrorHandler(message,statusCode);
    }

    const errorMessage = err.errors 
        ? Object.values(err.errors)
            .map(error=>error.message)
            .join(" ") 
        : err.message;


    return res.status(err.statusCode).json({
        success : false,
        message : errorMessage
    })
}

export default ErrorHandler;