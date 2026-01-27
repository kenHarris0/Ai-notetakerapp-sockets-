


import Subject from '../models/subject.model.js'

export const createSubject=async(req,res)=>{
try{
    const user=req.userId;
    const name=req.body.name;
    

   

    

    const newSubject=new Subject({
        name,
        owner:user,
        
      
    })
    await newSubject.save()
    res.json(newSubject)
}
catch(err){
    console.log(err)
}



}

export const createSubjectbygroup=async(req,res)=>{
    try{
    const user=req.userId;
    const name=req.body.name;
    const {groupId}=req.body;
if(!groupId){
    return res.json({message:"no group id found"})
}
    
const newSubject=new Subject({
        name,
        owner:user,
        groupId,    
      
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
        const secondfilter=filteredSubjects.filter(sub=>!sub.groupId)
        res.json(secondfilter)

    }
    catch(err){
        console.log(err)
    }
}

export const getallsubjectsbygroup=async(req,res)=>{
     try{
        const {groupid}=req.body;

        const filteredSubjects=await Subject.find({groupId:groupid}).sort({createdAt:1})

        res.json(filteredSubjects)
        

    }
    catch(err){
        console.log(err)
    }
}