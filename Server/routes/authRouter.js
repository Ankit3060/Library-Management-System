import express from "express"
import { register } from "../controller/authController.js";
import { verifyOTP } from "../controller/authController.js";

const router = express.Router();

router.post("/register",register);
router.post("/verify-otp",verifyOTP);

export default router;