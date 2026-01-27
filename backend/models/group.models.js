import mongoose from "mongoose"

const schema=new mongoose.Schema({
    name:{type:String},
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        }
    ],
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
    
   


},{timestamps:true})

const Group=mongoose.models.group || mongoose.model("group",schema);

export default Group;