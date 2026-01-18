import express from "express"
import  {getallsubjects,createSubject} from "../controllers/subject.controller.js"
import {authMiddleware} from '../middlewares/auth.middleware.js'

const router=express.Router()
router.use(authMiddleware)

router.post('/create',createSubject)
router.get('/getall',getallsubjects)


export default router;