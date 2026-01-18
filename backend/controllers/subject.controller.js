


import Subject from '../models/subject.model.js'

export const createSubject=async(req,res)=>{
try{
    const user=req.userId;
    const name=req.body.name;
    const newSubject=new Subject({
        name,
        owner:user
    })
    await newSubject.save()
    res.json(newSubject)
}
catch(err){
    console.log(err)
}



}

export const getallsubjects=async(req,res)=>{
    try{
        const {userId}=req;
        const filteredSubjects=await Subject.find({owner:userId}).sort({createdAt:1})
        res.json(filteredSubjects)

    }
    catch(err){
        console.log(err)
    }
}