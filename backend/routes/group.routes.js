import express from "express"
import  {deleteGroup,createGroup,getallusergroups,getgroupbyid,promoteuser,demoteuser,addusertogrp} from "../controllers/group.controller.js"
import {authMiddleware} from '../middlewares/auth.middleware.js'

const router=express.Router()
router.use(authMiddleware);
router.post('/create',createGroup);
router.get('/getall',getallusergroups);
router.post('/delete',deleteGroup);
router.post('/getbyid',getgroupbyid)
router.post('/promote',promoteuser)
router.post('/demote',demoteuser)
router.post('/add',addusertogrp)




export default router;