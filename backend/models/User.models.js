import mongoose from "mongoose"

const schema=new mongoose.Schema({
    name:{type:String},
    email:{type:String,unique:true},
    password:{type:String}
})

const User=mongoose.models.user || mongoose.model("user",schema);

export default User;