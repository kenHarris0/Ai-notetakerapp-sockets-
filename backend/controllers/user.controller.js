import User from "../models/User.models.js"
import bcrypt from "bcrypt"
import { assignCookie } from "../config/cookiehandler.js"


export const register=async(req,res)=>{
    try{
    const {name,email,password}=req.body

    if(!name || !email || !password){
        return res.json({message:"enter credentials properly"})
    }

    const encryptedpswd=await bcrypt.hash(password,10);

    const newuser=new User({
        name,email,
        password:encryptedpswd
    })
    await newuser.save()
    assignCookie(res,newuser._id)


    res.json(newuser)
}
catch(err){
    console.log(err)
}
}

export const login=async(req,res)=>{
    try{
    const {email,password}=req.body

    if(!email || !password){
        return res.json({message:"enter credentials properly"})
    }
    const user=await User.findOne({email:email})
    if(!user){
        return res.json({message:"please create an user"})
    }

    const checkpswd=await bcrypt.compare(password,user.password);
    if(!checkpswd){
        return res.json({message:"incorrect password try again"})
    }


    assignCookie(res,user._id)
    res.json(user)


    
}
catch(err){
    console.log(err)
}
}


export const logout=async(req,res)=>{
    try{
        res.cookie("jwt","",{
            maxAge:0
        })

        res.json({success:true,message:"logged out"})

    }
    catch(err){
    console.log(err)
}

}

export const getUserData=async(req,res)=>{
    try{
        const userId=req.userId;

        const user=await User.findById(userId);
         if(!user){
        return res.json({message:"please create an user"})
    }
    res.json(user)


    }
    catch(err){
    console.log(err)
}
}