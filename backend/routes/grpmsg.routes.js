import express from "express"
import  {sendMessage,getallmessages} from "../controllers/groupmsg.controller.js"
import {authMiddleware} from '../middlewares/auth.middleware.js'

const router=express.Router()
router.use(authMiddleware);
router.post('/create/:groupId',sendMessage);
router.get('/getall/:groupId',getallmessages);







export default router;