import cloudinary from "../config/cloudianary.js";
import Message from "../models/grpmsg.model.js";
import {io} from '../config/Socketconfig.js'
import { findUsersocketid } from "../config/Socketconfig.js";

export const sendMessage=async(req,res)=>{
    try{
        const senderId=req.userId;
        const groupId=req.params.groupId

        const {data,image}=req.body


        let img;

        if(image){
            const result=await cloudinary.uploader.upload(image)
            if(result.secure_url){
                img=result.secure_url;
            }
        }

        const newmsg=new Message({
            senderId,
            groupId,
            data,
            image:img
        })

        await newmsg.save()

        const populatedmsg=await newmsg.populate("senderId","name");
        io.to(groupId).emit("newgroupmessage",populatedmsg);

        res.json(populatedmsg);




    }
    catch(err){
        console.log(err)
    }
}

export const getallmessages=async(req,res)=>{
 try{
      const groupId=req.params.groupId;

      const messages=await Message.find({groupId}).populate("senderId","name");

      res.json(messages);



    }
    catch(err){
        console.log(err)
    }


}