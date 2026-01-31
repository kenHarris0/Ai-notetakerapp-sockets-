import mongoose from "mongoose"

const schema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"group"
    },
    data:{type:String},
    image:{type:String,default:""}
    
   


},{timestamps:true})

const Message=mongoose.models.message || mongoose.model("message",schema);

export default Message;