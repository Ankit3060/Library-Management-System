import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";


export const addBook = catchAsyncError(async(req,res,next)=>{
    //first check the metadata are clear or not
    // create a DB and save it
    // return the response

    const {title,author,description,price,quantity} = req.body;
    if(!title || !author || !description || !price ||  !quantity){
        throw new ErrorHandler("All these field are required",400);
    }

    const book = await Book.create({
        title,
        author,
        description,
        price,
        quantity,

    })

    res.status(201).json({
        success : true,
        message : "Book added successfully",
        book,
    });

});


export const getAllBooks = catchAsyncError(async(req,res,next)=>{
    const book = await Book.find();

    res.status(200).json({
        success : true,
        message : "Book fetched successfully",
        book,
    })
})


export const deleteBook = catchAsyncError(async(req,res,next)=>{
    const {id} = req.params;
    const book = await Book.findById(id);

    if(!book){
        throw new ErrorHandler("Book not found",400);
    }

    await book.deleteOne();

    res.status(201).json({
        success : true,
        message : "BOok deleted successfully",
        book,
    })
})
