
import Notes from '../models/notes.model.js'
import axios from 'axios';
import Group from '../models/group.models.js'
import {io,findUsersocketid} from '../config/Socketconfig.js'
import Subject from '../models/subject.model.js';

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

       const subject = await Subject.findById(subjectId);

if (subject?.groupId) {
  io.to(String(subject.groupId)).emit("newnotecreated", newnote);
}

        res.json(newnote)

    }
    catch(err){
        console.log(err)
    }
}

export const getallnotes=async(req,res)=>{
    try{
         
        
        

        const subjectnotes=await Notes.find().sort({createdAt:1})

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

export const summarizenote=async(req,res)=>{
  try{
    const {noteid}=req.body;
    const note=await Notes.findById(noteid)

    if(!note){
    return res.json({message:"Note not found"})
    }
   

    const resp=await axios.post('http://localhost:11434/api/generate',{
      model:"mistral",
      prompt: `
You are a strict note summarizer.

You MUST follow this exact structure.
DO NOT write paragraphs.
DO NOT merge lines.

Format RULES:
1. Every section MUST have a heading.
2. Under each heading, use ONLY bullet points.
3. Each bullet must be ONE short sentence.
4. NO long paragraphs.
5. NO storytelling.
6. NO emojis.

Use this format:

## Summary

### Topic 1
- point
- point

### Topic 2
- point
- point

### Topic 3
- point
- point

Now summarize the following note:

${note.content}
`
,
      stream:false,
    });
    res.json({payload:resp.data.response})

  }
  catch (err) {
    console.log(err)
   
  }
}

export const Rewritenote=async(req,res)=>{
  try{
    const {noteid}=req.body;
    const note=await Notes.findById(noteid)

    if(!note){
    return res.json({message:"Note not found"})
    }
   

    const resp=await axios.post('http://localhost:11434/api/generate',{
      model:"mistral",
      prompt: `
You are an intelligent note-rewriting assistant.

Task:
Rewrite the given content in a clearer, more professional, and well-structured way.
Slightly expand where useful by adding brief clarifications or examples, but do NOT add new topics.

Rules:
- Output must be in clean **Markdown**.
- Use clear headings and subheadings.
- Use bullet points where appropriate.
- Improve grammar and flow.
- Keep it concise and easy to study.
- Do NOT write long paragraphs.
- Do NOT change the meaning.
- Do NOT include any meta comments.

Use this structure:

## Improved Notes

### Topic 1
- point
- point

### Topic 2
- point
- point

Now rewrite and improve the following content:

${note.content}

`
,
      stream:false,
    });
    res.json({payload:resp.data.response})

  }
  catch (err) {
    console.log(err)
   
  }
}

export const deleteNote = async (req, res) => {
  try {
    const { noteId, groupId } = req.body;

    if (!noteId) {
      return res.status(400).json({ message: "noteId required" });
    }

    const note = await Notes.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "note not found" });
    }

    // 🔥 only validate + emit for group notes
    if (groupId) {
      const grp = await Group.findById(groupId);
      if (!grp) {
        return res.status(404).json({ message: "group not found" });
      }

      io.to(String(groupId)).emit("noteDeleted", note);
    }

    await Notes.findByIdAndDelete(noteId);

    return res.json(note);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error" });
  }
};
