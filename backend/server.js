import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import userRouter from './routes/user.routes.js'
import subRouter from './routes/subject.routes.js'
import noterouter from './routes/notes.routes.js'

const app=express();
dotenv.config();
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true,
}))
app.use(express.json());
app.use(cookieParser());


app.use('/user',userRouter);
app.use('/sub',subRouter)
app.use('/note',noterouter)



app.listen(5000,()=>{
    connectDB();
    console.log("SERVER IS RUNNING")
})