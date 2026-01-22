import express from "express"
import  {getallnotes,createNote,updatenote} from "../controllers/note.controller.js"
import {authMiddleware} from '../middlewares/auth.middleware.js'

const router=express.Router()
router.use(authMiddleware)

router.post('/create/:id',createNote)
router.get('/getall',getallnotes)
router.post('/update',updatenote)


export default router;