import mongoose from "mongoose"

const schema=new mongoose.Schema({
    name:{type:String},
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    subjectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'subject'
    },
    title:{type:String,default:""},
    content:{type:String,default:""},
    aisummary:{type:String,default:""}


},{timestamps:true})

const Notes=mongoose.models.note || mongoose.model("note",schema);

export default Notes;