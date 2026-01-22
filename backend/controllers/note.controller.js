import Notes from '../models/notes.model.js'

export const createNote=async(req,res)=>{
    try{
        const {userId}=req
        const {title}=req.body;
        const subjectId=req.params.id

        const newnote=new Notes({
            title,
            owner:userId,
            subjectId
        })
        await newnote.save()
        res.json(newnote)

    }
    catch(err){
        console.log(err)
    }
}

export const getallnotes=async(req,res)=>{
    try{
         const {userId}=req
        
        

        const subjectnotes=await Notes.find({owner:userId}).sort({createdAt:1})

        res.json(subjectnotes)

    }
    catch(err){
        console.log(err)
    }
}

export const updatenote = async (req, res) => {
  try {
    const { noteid, content } = req.body

    const note = await Notes.findByIdAndUpdate(
      noteid,
      { content },
      { new: true }
    )

    if (!note) {
      return res.status(404).json({ message: "Note not found" })
    }

    res.json(note)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Update failed" })
  }
}
