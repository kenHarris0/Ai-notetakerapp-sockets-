import React, { useEffect, useState } from 'react'
import { createContext } from 'react'
import axios from 'axios'



export const notecontext=createContext();

const Context = ({ children }) => {
    const url="http://localhost:5000"
    const [userdata,setuserdata]=useState(null)
    
    const getuserdata=async()=>{
      try{
        const res=await axios.get(url+'/user/getuserdata',{withCredentials:true})
        if (res.data && res.data._id) {
      setuserdata(res.data);
    } else {
      setuserdata(null);
    }

      }
      catch(err){
        console.log(err)
    }
    }

const [usersubjects,setusersubjects]=useState([])

   const getallusersubjects=async()=>{
      try{
        const res=await axios.get(url+'/sub/getall',{withCredentials:true})
        if (res.data) {
      setusersubjects(res.data);
      console.log(res.data)
    } else {
      setusersubjects([]);
    }
    } 

      
      catch(err){
        console.log(err)
    }

   }

   const [notes,setnotes]=useState([])

   const getallnotes=async()=>{
    try{
      const res=await axios.get(url+'/note/getall',{withCredentials:true})
        if (res.data) {
      setnotes(res.data);
      console.log(res.data)

    }
  }
    catch(err){
        console.log(err)
    }
   }


    const value={
url,userdata,setuserdata,getuserdata,
usersubjects,setusersubjects,getallusersubjects,
notes,setnotes,getallnotes

    }

    useEffect(()=>{
      getuserdata()
    },[])

console.log(userdata)
    
  return (
    <div >
        <notecontext.Provider value={value}>
            {children}
        </notecontext.Provider>
      
    </div>
  )
}

export default Context
