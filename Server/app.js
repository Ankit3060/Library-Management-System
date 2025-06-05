import express, { urlencoded } from "express";
import {config} from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRouter.js";
import borrowRouter from "./routes/borrowRouter.js";
import expressFileupload from "express-fileupload";
import userRouter from "./routes/userRouter.js";
import { notifyUser } from "./services/notifyUser.js";
import { removeUnverifiedAccount } from "./services/removeUnverifiedAccount.js";

export const app = express();

// defining the path of the config file
config({path: "./config/config.env"});

// Frontend backend connection
app.use(cors({
    origin : [process.env.FRONTEND_URL],
    methods : ["GET", "POST", "DELETE", "PUT"],
    credentials : true
}));

// setting the middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(expressFileupload({
    useTempFiles : true,
    tempFileDir : "/temp/"
}))


// Routers
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/book",bookRouter)
app.use("/api/v1/borrow",borrowRouter);
app.use("/api/v1/user",userRouter)

//notifying user
notifyUser();

// removing unverified accound
removeUnverifiedAccount();

// Connecting the DB
connectDB();

// Error middleware
app.use(errorMiddleware);