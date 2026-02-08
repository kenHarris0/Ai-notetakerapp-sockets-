import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {notecontext} from '../context/Context'
import axios from 'axios'


const Groupinfo = () => {



    const {id}=useParams()
    const {url,getallusers,allusers,userdata}=useContext(notecontext);
const [currgrp,setcurrgrp]=useState(null)
const [clickedplus,setclickedplus]=useState(false)
    const getthegroup=async()=>{
        try{
            const res=await axios.post(url+`/group/getbyid`,{id},{withCredentials:true});
            if(res.data){
               setcurrgrp(res.data)
               
            }

        }
        catch(err){
            console.log(err)
        }
    }

useEffect(()=>{
if(!id) return;
const currfunc=async()=>{
       await getthegroup();
}
currfunc();
},[id])

    useEffect(()=>{
        getallusers();

    },[])

    //promote user

    const promoteuser=async(userId)=>{
        try{
const res=await axios.post(url+`/group/promote`,{id:currgrp._id,userId},{withCredentials:true});
if(res.data){
               setcurrgrp(res.data)

               
            }
        }
        catch(err){
            console.log(err)
        }
    }
//demote user
  const demoteuser=async(userId)=>{
        try{
const res=await axios.post(url+`/group/demote`,{id:currgrp._id,userId},{withCredentials:true});
if(res.data){
               setcurrgrp(res.data)

               
            }
        }
        catch(err){
            console.log(err)
        }
    }


    const isadmin=currgrp?.admin?.some(member =>
  (member._id ? member._id : member).toString() === userdata?._id?.toString()
);
//add user to grp
const adduser=async(userId)=>{
    try{
const res=await axios.post(url+`/group/add`,{id:currgrp._id,userId},{withCredentials:true});
if(res.data){
               setcurrgrp(res.data)
               setclickedplus(false);

               
            }
        }
        catch(err){
            console.log(err)
        }
}
const newref=useRef(null);
    

useEffect(()=>{
    const clickfunction=(e)=>{
    if(clickedplus && 
        newref.current && 
        !newref.current.contains(e.target)
    ){
        setclickedplus(false);

    }
}

    document.addEventListener("mousedown",clickfunction);

    return ()=> document.removeEventListener("mousedown",clickfunction);

    




},[clickedplus])
  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center'>

        <div className='w-[50%] h-[75%] border flex flex-col items-start justify-start p-10 gap-10'>

            <span className='w-full flex  justify-between'>
                <p>{currgrp?.name}</p>
                {isadmin && <p className='text-2xl cursor-pointer w-7 h-7 ' onClick={()=>setclickedplus(prev=>!prev)}>+</p>}
                </span>

                {clickedplus && (
                    <div className='w-screen h-screen flex items-center justify-center bg-black/70 fixed inset-0 z-999'>

                        <div className='w-[20%] min-h-[20%] border p-5' ref={newref}>
                            <p>Users:</p>
                            {allusers.filter(user=>!currgrp?.members?.some(member=>(member._id ? member._id : member).toString()===user._id.toString())).map(
                                user=>{


                                    return(
                                        <span className='flex items-center justify-start gap-10'>
                                            <p>{user?.name}</p>
                                            <button className='w-20 border bg-green-500 text-center cursor-pointer' onClick={()=>adduser(user._id)}>add</button>
                                        </span>
                                        
                                    )
                                }
                            )}

                        </div>


                    </div>
                )}



            <div className='w-full flex flex-col items-start justify-start gap-5'>

                {
  currgrp?.members && allusers
    .filter(user =>
  currgrp.members.some(member =>
    (member._id ? member._id : member).toString() === user._id.toString()
  ))
    .map(user => {
        const isthisuseradmin = currgrp?.admin?.some(member =>
  (member._id ? member._id : member).toString() === user._id.toString()
);

        
        return(
    

      <div key={user._id} className='w-[40%] flex items-center justify-between gap-10 '>
        
            <p className={isthisuseradmin?"text-yellow-200":""}>{user.name}</p>
            
        
        
            {isadmin && (<div className=' w-[60%] flex items-center justify-end gap-5'>
            <p className='w-20 border bg-green-500 text-center cursor-pointer' onClick={()=>promoteuser(user._id)}>promote</p>
            <p className='w-20 border bg-red-500 text-center cursor-pointer' onClick={()=>demoteuser(user._id)}>kick</p>

            </div>
            )}  


          
       
      </div>
    )})
      
}

<button className='w-40 border bg-red-500 text-center cursor-pointer' onClick={()=>demoteuser(userdata?._id)}>LEAVE COLAB</button>


            </div>

            


            

        </div>
      
    </div>
  )
}

export default Groupinfo
