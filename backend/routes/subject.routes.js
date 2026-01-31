import express from "express"
import  {getallsubjects,createSubject,getallsubjectsbygroup,createSubjectbygroup,deleteausersubject,deleteaGRPsubject} from "../controllers/subject.controller.js"
import {authMiddleware} from '../middlewares/auth.middleware.js'

const router=express.Router()
router.use(authMiddleware)

router.post('/create',createSubject)
router.post('/gcreate',createSubjectbygroup)
router.get('/getall',getallsubjects)
router.post('/getallbygrp',getallsubjectsbygroup)

router.post('/delsub',deleteausersubject);
router.post('/delgrpsub/:groupId',deleteaGRPsubject);



export default router;