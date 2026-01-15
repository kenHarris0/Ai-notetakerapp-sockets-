import cookieParser from "cookie-parser";
import User from "../models/User.models.js";
import jwt from "jsonwebtoken";

export const authMiddleware=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        if(!token){
            return res.json({message:"please login first"})
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.json({message:"invalid credentials"})
        }

        const user=await User.findById(decoded.userId);
        if(!user){
            return res.json({message:"user not found"})
        }
        req.user=user;
        req.userId=decoded.userId;

        next();

    }
    catch(err){
        console.log(err)
    }
}