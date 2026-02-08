import React, { useEffect, useState } from 'react'
import { createContext } from 'react'
import axios from 'axios'
import {io} from 'socket.io-client'
import {toast} from 'react-toastify'

export const notecontext=createContext();

const Context = ({ children }) => {
    const url="http://localhost:5000"
    const [userdata,setuserdata]=useState(null)
    const [socket,setsocket]=useState(null);
    const [onlineuser,setonlineusers]=useState([])
    const [groupMessages,setgroupMessages]=useState([]);
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

   //sockets

   const connectSocket=async()=>{
    if(!userdata) return;
    try{
      if(socket){
        socket.disconnect();
        setsocket(null);
      }
      const newsocket=io(url,{
        withCredentials:true
      });
      setsocket(newsocket);


      newsocket.on("getonlineusers",(onlineusrs)=>{
        setonlineusers(onlineusrs);
        console.log(onlineusrs.length)
      })
      
        newsocket.on("newgroupmessage", (newmsg) => {
  setgroupMessages(prev => [...prev, newmsg]);
});






    }
    catch(err){
        console.log(err)
    }

   }

   const disconnectSocket=()=>{
    if(!socket || !userdata) return;
    try{
      socket.disconnect()
      setsocket(null)


    }
    catch(err){
        console.log(err)
    }
   }
//get all users in app
const [allusers,setallusers]=useState([])
const getallusers=async()=>{
  try{
     const res=await axios.get(url+'/user/getallusers',{withCredentials:true})
        if (res.data) {
      setallusers(res.data);
      
    }
  }
     


  catch(err){
        console.log(err)
    }
}

// group chat feature




const getallmessages=async(groupId)=>{
  try{
    const res=await axios.get(url+`/msg/getall/${groupId}`,{withCredentials:true});
    if(res.data){
      setgroupMessages(res.data)

    }

  }
  catch(err){
        console.log(err)
    }

}
const [activeGroupId, setActiveGroupId] = useState(null);




    const value={
url,userdata,setuserdata,getuserdata,
usersubjects,setusersubjects,getallusersubjects,
notes,setnotes,getallnotes,

socket,connectSocket,disconnectSocket,onlineuser,

getallusers,allusers,setallusers,

groupMessages,setgroupMessages,getallmessages,

activeGroupId, setActiveGroupId


    }

    useEffect(()=>{
      getuserdata()
      
    },[])

    useEffect(() => {
  if (userdata) {
    connectSocket();
  }
}, [userdata]);

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
