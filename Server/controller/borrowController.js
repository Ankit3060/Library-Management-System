import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Book } from "../models/bookModel.js";
import { Borrow } from "../models/borrowModel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";


export const recordBorrowedBooks = catchAsyncError(async(req,res,next)=>{
    const {id} = req.params;
     const { email } = req.body;

    const book = await Book.findById(id);
    if(!book){
        throw new ErrorHandler("Book not found",400);
    }

    const user = await User.findOne({email,accountVerified : true});
    if(!user){
        throw new ErrorHandler("user not found",400);
    }

    if(book.quantity == 0){
        throw new ErrorHandler("Book not available",400);
    }

    const isAlreadyBorrowed = user.borrowBooks.find( 
        (b)=>b.bookId.toString() === id && b.returned === false
     );
     if(isAlreadyBorrowed){
        throw new ErrorHandler("Book already borrowed",400);
     }

     book.quantity -= 1;
     book.availability = book.quantity>0;
     await book.save();

     user.borrowBooks.push({
        bookId : book._id,
        bookTitle : book.title,
        borrowDate : new Date(),
        dueDate : new Date(Date.now()+7*24*60*60*1000),
     })

     await user.save();

     await Borrow.create({
        user:{
            id : user._id,
            email : user.email,
            name : user.name,
        },
        book : book._id,
        dueDate : new Date(Date.now()+7*24*60*60*1000),
        price : book.price,
     });

     res.status(200).jason({
        success : true,
        message : "Borrowed book recorded successfully",
     })
});



export const returnBorrowedBook = catchAsyncError(async(req,res,next)=>{
    const {bookId} = req.params;
    const {email} = req.body;

    const book = await Book.findById(bookId);
    if(!book){
        throw new ErrorHandler("Book not found",400);
    }

    const user = await User.findOne({email,accountVerified : true});
    if(!user){
        throw new ErrorHandler("User not found",400);
    }

    const borrowedBooks = user.borrowBooks.find(
        b=>b.bookId.toString()===bookId && b.returned === false
    );
    if(!borrowedBooks){
        throw new ErrorHandler("You have not borrowed this book",400);
    }

    borrowedBooks.returned = true;
    await user.save();

    book.quantity += 1;
    book.availability = book.quantity>0;

    await book.save();

    const borrow = await Borrow.findOne({
        book : bookId,
        "user.email" : email,
        returnDate : null,
    });
    if(!borrow){
        throw new ErrorHandler("Book not borrowed",400);
    }

    borrow.returnDate = new Date();
    const fine = calculateFine(borrow.dueDate);
    borrow.fine = fine;

    await borrow.save();

    res.status(200).json({
        success : true,
        message : fine!== 0 
                    ? `Book returned successfully. The fine including price is ₹${fine+book.price}`
                    :`Book returned successfully. The charges are ₹${book.price}`
    })
});



export const borrowedBooks = catchAsyncError(async(req,res,next)=>{
  const { borrowBooks } = req.user;

  res.status(200).json({
    success: true,
    borrowBooks,
  });
});



export const getBorrowedBooksForAdmin = catchAsyncError(async(req,res,next)=>{
    const borrowBooks = await Borrow.find();

    res.status(200).json({
    success: true,
    borrowBooks,
  });
});