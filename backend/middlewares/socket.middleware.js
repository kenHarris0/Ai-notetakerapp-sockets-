import jwt from 'jsonwebtoken';
import User from '../models/User.models.js';
import dotenv from 'dotenv';


dotenv.config()


export const socketMiddleware=async(socket,next)=>{
    try{

        const token=socket?.handshake.headers.cookie?.split("; ")?.
        find(row=>row.startsWith("jwt="))?.split("=")[1];

        if(!token){
             return next(new Error("NO_TOKEN"));
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
             return next(new Error("invalid token"));
        }

        const user=await User.findById(decoded.userId);
        if(!user){
             return next(new Error("NO_USER_FOUND"));
        }
        socket.user=user;
        socket.userId=decoded.userId;

        next();

    }
    catch(err){
        console.log(err)
        return next(new Error("invalid_token"));
    }
}