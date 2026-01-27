import mongoose from "mongoose"

const schema=new mongoose.Schema({
    name:{type:String},
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'group'
    }
    

},{timestamps:true})

const Subject=mongoose.models.subject || mongoose.model("subject",schema);

export default Subject;