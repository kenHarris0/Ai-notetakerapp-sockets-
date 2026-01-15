import express from "express"
import  {register,login,logout,getUserData} from "../controllers/user.controller.js"
import {authMiddleware} from '../middlewares/auth.middleware.js'

const router=express.Router()

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)
router.get('/getuserdata',authMiddleware,getUserData)

export default router;