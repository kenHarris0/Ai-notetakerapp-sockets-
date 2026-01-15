import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const assignCookie=async(res,userId)=>{
    try{
        const token=jwt.sign({userId:userId},process.env.JWT_SECRET,{expiresIn:"2d"})

        res.cookie("jwt",token,{
            secure:false,
            maxAge:2*24*60*60*1000,
            sameSite:"lax",
            httpOnly:true
        })

        return token;

    }
    catch(err){
        console.log(err)
    }
}