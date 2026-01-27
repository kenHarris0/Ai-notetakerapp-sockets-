import express from "express"
import  {getallsubjects,createSubject,getallsubjectsbygroup,createSubjectbygroup} from "../controllers/subject.controller.js"
import {authMiddleware} from '../middlewares/auth.middleware.js'

const router=express.Router()
router.use(authMiddleware)

router.post('/create',createSubject)
router.post('/gcreate',createSubjectbygroup)
router.get('/getall',getallsubjects)
router.post('/getallbygrp',getallsubjectsbygroup)


export default router;