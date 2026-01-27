import express from "express"
import  {register,login,logout,getUserData,getallusers} from "../controllers/user.controller.js"
import {authMiddleware} from '../middlewares/auth.middleware.js'

const router=express.Router()

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.get('/getuserdata',authMiddleware,getUserData)
router.get('/getallusers',getallusers)

export default router;