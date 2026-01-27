import Group from '../models/group.models.js';
import {io} from '../config/Socketconfig.js';
import {findUsersocketid} from '../config/Socketconfig.js'



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

export const deleteGroup = async (req, res) => {
  try {
    const { groupid } = req.body;
    const { userId } = req;

    const group = await Group.findById(groupid);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isAdmin = String(group.admin) === String(userId);

    if (!isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this group" });
    }

    await Group.findByIdAndDelete(groupid);

    // emit to all sockets in this group room
    io.to(groupid.toString()).emit("groupDeleted", groupid);

    res.json({ message: "Group deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


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