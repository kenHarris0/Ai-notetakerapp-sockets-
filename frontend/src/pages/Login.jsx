import React, { useContext, useState } from 'react'
import { useEffect, useRef } from "react";
import TOPOLOGY from "vanta/dist/vanta.topology.min";
import p5 from "p5";
import axios from 'axios';
import { notecontext } from '../context/Context';
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
const Login = () => {


    const vantaRef = useRef(null);


useEffect(() => {
 
   const effect = TOPOLOGY({
      el: vantaRef.current,
      p5,               
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1,
      scaleMobile: 1,
      color: 0xa9bd3a,
      backgroundColor: 0x572f51
    });
  

  return effect.destroy();
}, []);

const {url,userdata,setuserdata}=useContext(notecontext)
const [logindata,setlogindata]=useState({
    name:"",
    email:"",
    password:""
})

const [logintype,setlogintype]=useState("login")
const navv=useNavigate()
const handlechange=(e)=>{
    const {name,value}=e.target

    setlogindata(item=>({...item,[name]:value}))
}

const handlesubmit=async(e)=>{
    e.preventDefault();
    try{
        if(logintype==="register"){
            const res=await axios.post(url+"/user/register",logindata,{withCredentials:true})
            if(res.data){
                setuserdata(res.data)
                console.log(res.data)
                setlogindata({
                    name:"",
                    email:"",
                    password:""
                })
                toast.success("logged in Successfully")
                setTimeout(() => {
                    navv("/")

                    
                }, 1000);

            }



        }
        else if(logintype==="login"){

            const res=await axios.post(url+"/user/login",{email:logindata.email,password:logindata.password},{withCredentials:true})
            if(res.data){
                setuserdata(res.data)
                console.log(res.data)
                toast.success("logged in  Successfully")
                setlogindata({
                    email:"",
                    password:""
                })

                setTimeout(() => {
                    navv("/")

                    
                }, 1000);

            }

        }

    }
    catch(err){
        console.log(err)
    }
}

  return (
    <div className='w-screen h-screen flex items-center justify-center'>

        <div className='w-[70%] h-170 flex border'>

            <div className='w-[70%] h-full border flex items-center justify-center' ref={vantaRef}>
                <h1 className='text-[60px]'>Welcome to Notelm</h1>

            </div>

            <div className='w-[30%] h-[50%] flex flex-col items-center justify-center  mt-40'>

                <form onSubmit={handlesubmit} className='w-full h-full flex flex-col items-center justify-center gap-5'>
                    {logintype==="register" &&<input type="text"  name='name' value={logindata.name} placeholder='Name' className=' border p-3 rounded-4xl' onChange={handlechange}/>}
                    <input type="email"  name='email' value={logindata.email} placeholder='Email' className=' border p-3 rounded-4xl' onChange={handlechange}/>
                    <input type="password"  name='password' value={logindata.password} placeholder='Password' className=' border p-3 rounded-4xl' onChange={handlechange}/>
                    <button type="submit" className='cursor-pointer hoveranimation'>{logintype==="login"?"LOGIN":"REGISTER"}</button>
                </form>

                {logintype==="login"?<p onClick={()=>setlogintype("register")} className='cursor-pointer'>Don't have an account?</p>:<p onClick={()=>setlogintype("login")} className='cursor-pointer hoveranimation'>Already have an account?</p>} 

            </div>

        </div>
      
    </div>
  )
}

export default Login
