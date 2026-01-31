import Group from '../models/group.models.js';
import {io} from '../config/Socketconfig.js';
import {findUsersocketid} from '../config/Socketconfig.js'
import Subject from '../models/subject.model.js'
import Notes from '../models/notes.model.js'


export const createGroup=async(req,res)=>{
    try{
        const {name,members}=req.body;
        const {userId}=req;
        

        if(!name || members.length<1){
            return res.status(400).json({message:"Invalid data"})
        }
         if (!members.some(id => id.toString() === userId.toString())) {
      members.push(userId);
    }

        const group=new Group({
            name,members,

            admin:userId
        })
        await group.save();
        res.json(group)

        //notify the groupmembers about creation of new group
        members.forEach(member=>{
            const usersocket=findUsersocketid(member._id?.toString()) 
            if(usersocket){
                io.to(usersocket).emit("newgroupcreated",group)
            }
        })

    }
    catch(err){
        console.log(err)
    }
}




export const getallusergroups=async(req,res)=>{
  try{

    const {userId}=req;

    const groups=await Group.find({members:userId});
    res.json(groups)

  }
  catch (err) {
    console.error(err);
    
  }
}

export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    if (!groupId) return res.status(400).json("no groupid sent");

 
    const grp = await Group.findById(groupId);
    if (!grp) return res.status(404).json("group not found");

   
    const subjects = await Subject.find({ groupId }).select("_id");

    await Promise.all(
      subjects.map(sub =>
        Notes.deleteMany({ subjectId: sub._id })
      )
    );

    await Subject.deleteMany({ groupId });

    
    grp.members.forEach(memberId => {
      const socketId = findUsersocketid(memberId.toString());
      if (socketId) {
        io.to(socketId).emit("groupDeleted", {
          groupId,
          name: grp.name
        });
      }
    });

   
    await Group.findByIdAndDelete(groupId);

    res.json({ message: "group deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json("server error");
  }
};
