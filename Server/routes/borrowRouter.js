import express from "express";
import{
        borrowedBooks,
        recordBorrowedBooks,
        getBorrowedBooksForAdmin,
        returnBorrowedBook
    } from "../controller/borrowController.js"
import { isAuthenticated, isAuthorized } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/record-borrow-book/:id",isAuthenticated,isAuthorized("Admin"),recordBorrowedBooks);
router.get("/borrowed-books-by-user",isAuthenticated,isAuthorized("Admin"),getBorrowedBooksForAdmin);
router.get("/my-borrowed-books",isAuthenticated,borrowedBooks);
router.put("/return-borrow-book/:bookId",isAuthenticated,isAuthorized("Admin"),returnBorrowedBook);

export default router;