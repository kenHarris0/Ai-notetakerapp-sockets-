import express from "express"
import  {getallnotes,createNote} from "../controllers/note.controller.js"
import {authMiddleware} from '../middlewares/auth.middleware.js'

const router=express.Router()
router.use(authMiddleware)

router.post('/create/:id',createNote)
router.get('/getall/:id',getallnotes)


export default router;