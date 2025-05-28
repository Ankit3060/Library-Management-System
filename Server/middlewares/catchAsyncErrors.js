export const catchAsyncError = (theFunction)=>{
    return (res,req,next)=>{
        Promise.resolve(theFunction(req,res,next)).catch(next);
    }
}