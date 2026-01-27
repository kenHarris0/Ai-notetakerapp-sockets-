import express from "express"
import  {deleteGroup,createGroup,getallusergroups} from "../controllers/group.controller.js"
import {authMiddleware} from '../middlewares/auth.middleware.js'

const router=express.Router()
router.use(authMiddleware);
router.post('/create',createGroup);
router.get('/getall',getallusergroups);
router.post('/delete',deleteGroup);






export default router;