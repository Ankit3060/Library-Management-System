import express from "express";
import {registerNewAdmin,getAllUser} from "../controller/userController.js";
import { isAuthenticated,isAuthorized } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.get("/all",isAuthenticated,isAuthorized("Admin"),getAllUser);
router.post("/add/new-admin",isAuthenticated,isAuthorized("Admin"),registerNewAdmin);

export default router;