import mongoose from "mongoose"

const schema=new mongoose.Schema({
    name:{type:String},
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    

},{timestamps:true})

const Subject=mongoose.models.subject || mongoose.model("subject",schema);

export default Subject;