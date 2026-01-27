import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {notecontext} from '../context/Context'
import axios from 'axios'
import { toast } from 'react-toastify'


const Navbar = () => {
    const navv=useNavigate()
    const {userdata,setuserdata,url,getuserdata}=useContext(notecontext)
    const [showdropdown,setshowdropdown]=useState(false)
const logout=async()=>{
    try{
         const res=await axios.post(url+"/user/logout",{},{withCredentials:true})
            if(res.data){
                setuserdata(null)
                toast.success("logged out successfully")
                setshowdropdown(false)


            }

    }
    catch(err){
        console.log(err)
    }
}
useEffect(()=>{
    getuserdata();
},[])

  return (
    <div className='w-[80%] h-15 m-auto  bg-black text-white flex items-center justify-between fixed top-0 gap-10 p-3 '>
        <div className='w-[40%] flex items-center justify-between  gap-7'>

            <h1 className='text-4xl cursor-pointer' onClick={()=>navv('/')}>Notelm</h1>

            <div className='flex items-center jsutify-center gap-10'>
                <p className='cursor-pointer' onClick={()=>navv('/')}>Notes</p>
                <p className='cursor-pointer' onClick={()=>navv('/')}>Features</p>
                <p className='cursor-pointer' onClick={()=>navv('/')}>About us</p>
            </div>

        </div>

        <div className='w-[40%] flex items-center justify-end pr-10 relative'>
            {userdata ? <h1 className='text-[30px] flex items-center justify-center  w-10 h-10 border-3 bg-gray-600 rounded-full cursor-pointer' onClick={()=>setshowdropdown(prev=>!prev)}>{userdata?.name?.[0]?.toUpperCase()}</h1> : <p className='cursor-pointer' onClick={()=>navv('/login')}>Login</p>}
             {showdropdown && <div>
                <h2 className='absolute top-12 right-9 cursor-pointer' onClick={()=>logout()}>Logout</h2>
                
                </div>}
        </div>
      
    </div>
  )
}

export default Navbar
