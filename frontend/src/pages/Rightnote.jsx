import React, { useContext, useEffect, useRef, useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import axios from 'axios'
import {toast} from 'react-toastify';
import { notecontext } from '../context/Context';
import { BrainCog } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';



const Rightnote = ({selectednote}) => {
  const [value, setValue] = useState("")
const {url,getallnotes,userdata}=useContext(notecontext)

  const [showpreview,setshowpreview]=useState(false);
  const [clickedpreview,setclickedpreview]=useState(false)
  // summarizing functionality
  const [clickSummarize,setclicksummarize]=useState(false);
  const [aisummary,setaisummary]=useState("")
  const [loading,setloading]=useState(true)
  const clickref=useRef(null)

  //rewrite functionality
  const [rewriteclick,setrewriteclick]=useState(false);
  const [rewritecontent,setrewritecontent]=useState("");
  const rewriteref=useRef(null)
  

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

  const summarizecontent=async()=>{
    if(!value) return ""
    try{
      const res=await axios.post(url+'/note/summarize',{noteid:selectednote?._id},{withCredentials:true})
      if(res.data.payload){
        toast.success("summarized successfully")
        console.log(res.data.payload)
        setaisummary(res.data.payload)
        setloading(false);
        
      }


    }
    catch(err){
      console.log(err)
    }
    
  }
  //rewrite the content function
  const RewriteContent=async()=>{
    if(!value) return ""
    try{
      const res=await axios.post(url+'/note/rewrite',{noteid:selectednote?._id},{withCredentials:true})
      if(res.data.payload){
        toast.success("Rewritten successfully")
        console.log(res.data.payload)
        setrewritecontent(res.data.payload)
        setloading(false);
        
      }


    }
    catch(err){
      console.log(err)
    }
  }
    
  


    
    
   
  useEffect(()=>{
    function handleClickOutside(e){
      if(clickSummarize &&
      clickref.current &&
      !clickref.current.contains(e.target)){
        setclicksummarize(false);
        setloading(true);
        setaisummary("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },[clickSummarize]);

  useEffect(()=>{
    function handleclickoutside(e){
      if(rewriteclick && rewriteref.current &&
        !rewriteref.current.contains(e.target)){
          setrewritecontent("");
          setrewriteclick(false);
          setloading(true);
          
          
        }
      
    }

    document.addEventListener("mousedown",handleclickoutside)

    return()=>document.removeEventListener("mousedown",handleclickoutside)

  },[rewriteclick])

  const applyRewriteContenttomainContent=async()=>{
    try{
       const res=await axios.post(url+'/note/update',{noteid:selectednote?._id,content:rewritecontent},{withCredentials:true})
      if(res.data){
        toast.success("Note Updated successfully")
        setValue(res.data.content)
        setrewritecontent("");
        setrewriteclick(false);
        setloading(true);
        
        
      }

    }
    catch(err){
      console.log(err)
    }

  }



  return (
    <div className="w-full h-full p-6 bg-linear-to-br from-black via-zinc-900 to-black overflow-y-auto relative">
      {clickSummarize && (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
    <div className="w-1/2 max-h-[70%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white flex flex-col gap-4" ref={clickref}>
      <h1 className="text-xl font-semibold text-amber-300">AI Summary</h1>

      {loading ? 
      <LoaderCircle className='w-5 h-5 animate-spin'/> :
      <div className="flex-1 overflow-y-auto text-sm leading-relaxed">
        <MDEditor.Markdown source={aisummary} className=' bg-transparent wmde-markdown'  />
       
      </div>
}

      <button
        className="self-end px-4 py-2 rounded-lg bg-amber-400 text-black hover:bg-amber-300"
        onClick={() => {setclicksummarize(false);
setaisummary("");
setloading(true);
        }
        }
      >
        Close
      </button>
    </div>
  </div>
)}

{/* Rewrite Modal */}

{rewriteclick && (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
    <div className="w-1/2 max-h-[70%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-white flex flex-col gap-4" ref={rewriteref}>
      <h1 className="text-xl font-semibold text-amber-300">Rewriter</h1>

      {loading ? 
      <LoaderCircle className='w-5 h-5 animate-spin'/> :
      <div className="flex-1 overflow-y-auto text-sm leading-relaxed">
        <MDEditor.Markdown source={rewritecontent} className=' bg-transparent wmde-markdown'  />
       
      </div>
}

<div className='flex items-center justify center gap-5'>
      <button
        className="self-end px-4 py-2 rounded-lg bg-amber-400 text-black hover:bg-amber-300"
        onClick={() => {
          setrewriteclick(false);
setrewritecontent("");
setloading(true);
        }
        }
      >
        Close
      </button>
      <button className='self-end px-4 py-2 rounded-lg bg-green-400 text-black hover:bg-green-300' onClick={applyRewriteContenttomainContent}>Apply Content</button>
      </div>
    </div>
  </div>
)}



  <div className="w-full h-full rounded-2xl bg-black/70  border border-white/10 shadow-xl flex flex-col">

        {showpreview? 
        <div className='w-full h-[90%] border-b overflow-y-auto '>
          <MDEditor.Markdown source={value} className='w-full min-h-full wmde-markdown' />
</div>:

<MDEditor
          value={value}
          onChange={setValue}
          height="90%"
          preview="edit"
        />}
        <div className='flex w-1/2 h-[10%] justify-start gap-5 items-center pl-10' >
          <button className='border rounded-3xl w-20 h-7 cursor-pointer hover:scale-[1.15] hover:bg-gray-300 text-xs hover:text-black shadow-xl shadow-white/10 transform-[all 0.2s ease-in-out]' onClick={()=>updatenotecontent(selectednote?._id,value)}>Save</button>
          <button
  className="border flex items-center justify-center gap-2 rounded-3xl w-34 p-1 h-7 cursor-pointer hover:scale-105 text-xs hover:bg-gray-300 shadow-xl shadow-white/10 hover:text-black transition-all"
  onClick={() => {
    setclicksummarize(true);
    summarizecontent();
  }}
>
  <BrainCog /> <span>AI Summarize</span>
</button>

          <button className='border rounded-3xl w-25 h-7 cursor-pointer hover:scale-[1.15] hover:bg-gray-300 text-xs shadow-xl shadow-white/10 hover:text-black transform-[all 0.2s ease-in-out]' onClick={()=>{
            setshowpreview(prev=>!prev);
            setclickedpreview(prev=>!prev)
          }}>{clickedpreview?"Edit":"Preview"}</button>
          <button className='border rounded-3xl w-27 h-7 cursor-pointer hover:scale-[1.15] hover:bg-gray-300 text-xs shadow-xl shadow-white/10 hover:text-black transform-[all 0.2s ease-in-out]'
          onClick={()=>{
            setrewriteclick(prev=>!prev);
            RewriteContent();
          }} >Rewrite with Ai</button>
        </div>
      </div>
    </div>
  )
}

export default Rightnote
