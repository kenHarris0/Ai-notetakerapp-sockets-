import React, { useContext, useEffect, useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import axios from 'axios'
import {toast} from 'react-toastify';
import { notecontext } from '../context/Context';


const Rightnote = ({selectednote}) => {
  const [value, setValue] = useState("")
const {url,getallnotes,userdata}=useContext(notecontext)

  const [showpreview,setshowpreview]=useState(false);
  

  const updatenotecontent=async(noteid,value)=>{
    try{
      const res=await axios.post(url+'/note/update',{noteid,content:value},{withCredentials:true})
      if(res.data){
        toast.success("Note updated successfully")
        setValue(res.data.content)
      }


    }
    catch(err){
      console.log(err)
    }
  }


  useEffect(()=>{
    if(selectednote?.content){
      setValue(selectednote.content)
    }
    else{
      setValue("")
    }
    
  },[selectednote])


   useEffect(()=>{
      if(!userdata) return;
       getallnotes()
    },[])

  return (
    <div className="w-full h-full p-6 bg-black">
      <div className="w-full h-full bg-black rounded-xl shadow-sm">
        {showpreview? <div className='w-full h-[80%] border-b overflow-y-auto '>
          <MDEditor.Markdown source={value} />


        </div>:<MDEditor
          value={value}
          onChange={setValue}
          height="80%"
          preview="edit"
        />}
        <div className='flex w-1/2 justify-between items-center pt-20 pl-20' >
          <button className='border rounded-3xl w-25 h-9 cursor-pointer hover:scale-[1.15] hover:bg-gray-300 hover:text-black transform-[all 0.2s ease-in-out]' onClick={()=>updatenotecontent(selectednote?._id,value)}>Submit</button>
          <button className='border rounded-3xl w-40 h-9 cursor-pointer hover:scale-[1.15] hover:bg-gray-300 hover:text-black transform-[all 0.2s ease-in-out]'>Ai Enhancement</button>
          <button className='border rounded-3xl w-25 h-9 cursor-pointer hover:scale-[1.15] hover:bg-gray-300 hover:text-black transform-[all 0.2s ease-in-out]' onClick={()=>setshowpreview(prev=>!prev)}>Preview</button>
        </div>
      </div>
    </div>
  )
}

export default Rightnote
