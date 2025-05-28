import express, { urlencoded } from "express";
import {config} from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";


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


// Connecting the DB
connectDB();

// Error middleware
app.use(errorMiddleware);