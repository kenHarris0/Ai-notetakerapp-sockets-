import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import userRouter from './routes/user.routes.js'
import subRouter from './routes/subject.routes.js'
import noterouter from './routes/notes.routes.js'
import groupRouter from './routes/group.routes.js'
import {app,server} from './config/Socketconfig.js'
import messagerouter from './routes/grpmsg.routes.js'

dotenv.config();

app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json({ limit: "10mb" }))
app.use(cookieParser());


app.use('/user',userRouter);
app.use('/sub',subRouter)
app.use('/note',noterouter)
app.use('/group',groupRouter)
app.use('/msg',messagerouter)



server.listen(5000,()=>{
    connectDB();
    console.log("SERVER IS RUNNING")
})