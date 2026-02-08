import express from "express"
import  {getallnotes,createNote,updatenote,summarizenote,Rewritenote,deleteNote} from "../controllers/note.controller.js"
import {authMiddleware} from '../middlewares/auth.middleware.js'

const router=express.Router()
router.use(authMiddleware)

router.post('/create/:id',createNote)
router.get('/getall',getallnotes)
router.post('/update',updatenote)
router.post('/summarize',summarizenote)
router.post('/rewrite',Rewritenote)
router.post('/delete',deleteNote)


export default router;