


import Subject from '../models/subject.model.js'
import {io,findUsersocketid} from '../config/Socketconfig.js'
import Notes from '../models/notes.model.js';
import Group from '../models/group.models.js';
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

    io.to(String(groupId)).emit("newsubcreated",newSubject);
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


export const deleteausersubject = async (req, res) => {
  try {
    const { subjectId } = req.body;
    const userId = req.userId;

    if (!subjectId)
      return res.status(400).json({ message: "subjectId required" });

    const subject = await Subject.findOne({
      _id: subjectId,
      owner: userId,
      groupId: null
    });

    if (!subject)
      return res.status(403).json({ message: "Unauthorized or not found" });

    await Notes.deleteMany({ subjectId });
    await Subject.findByIdAndDelete(subjectId);

    res.json({ message: "user subject deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
};


export const deleteaGRPsubject = async (req, res) => {
  try {
    const { subjectId } = req.body;
    const { groupId } = req.params;

    if (!groupId || !subjectId)
      return res.status(400).json({ message: "missing fields" });

    const subject = await Subject.findOne({
      _id: subjectId,
      groupId
    });

    if (!subject)
      return res.status(404).json({ message: "subject not found" });

    await Notes.deleteMany({ subjectId });
    await Subject.findByIdAndDelete(subjectId);
    const grp=await Group.findById(groupId);
    if(!grp){
      return res.json("no group found")
    }

    grp.members.forEach(memberId => {
          const socketId = findUsersocketid(memberId.toString());
          if (socketId) {
            io.to(socketId).emit("grpsubdeleted", {
              subjectId,
              name: subject.name
            });
          }
        });

    res.json({ message: "group subject deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
};
