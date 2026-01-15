import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import userRouter from './routes/user.routes.js'

const app=express();
dotenv.config();
app.use(cors())
app.use(express.json());
app.use(cookieParser());


app.use('/user',userRouter);



app.listen(5000,()=>{
    connectDB();
    console.log("SERVER IS RUNNING")
})