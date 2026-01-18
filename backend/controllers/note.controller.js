import Notes from '../models/notes.model.js'

export const createNote=async(req,res)=>{
    try{
        const {userId}=req
        const {name,title,content}=req.body;
        const subjectId=req.params.id

        const newnote=new Notes({
            name,title,content,
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
        
        const subjectId=req.params.id

        const subjectnotes=await Notes.find({owner:userId,subjectId}).sort({createdAt:1})

        res.json(subjectnotes)

    }
    catch(err){
        console.log(err)
    }
}