import express from "express"
import { forgetPassword, getUser, login, logout, register, resetPassword, updatePassword } from "../controller/authController.js";
import { verifyOTP } from "../controller/authController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/register",register);
router.post("/verify-otp",verifyOTP);
router.post("/login",login);
router.get("/logout",isAuthenticated,logout);
router.get("/me",isAuthenticated,getUser);
router.post("/password/forget",forgetPassword);
router.put("/password/reset/:token",resetPassword);
router.put("/password/update",isAuthenticated,updatePassword);

export default router;