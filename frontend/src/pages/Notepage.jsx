import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import Rightnote from './Rightnote'
import { notecontext } from '../context/Context'
import {gsap} from 'gsap'
import axios from 'axios'
import { toast } from 'react-toastify'


const Notepage = () => {
  const {
    userdata,
    usersubjects,
    getallusersubjects,
    notes,url,
    getallnotes
  } = useContext(notecontext)

  const [clicksubject, setclicksubject]=useState(null);
  const [selectednote, setselectednote]=useState(null)
  const [togglenoteplus,settogglenoteplus]=useState(false)
  const [notetitle,setnotetitle]=useState("")
  const clickoutsideRef=useRef(null);

  useEffect(() => {
    if (!userdata) return

    const runthis = async () => {
      await getallusersubjects()
      await getallnotes()
    }

    runthis()
  }, [userdata])

  useEffect(()=>{
    if(!userdata) return;
     getallnotes()
  },[selectednote])


  const notesBySubject = useMemo(() => {
  if (!usersubjects || !notes) return {}

  const map = {}

  usersubjects.forEach(sub => {
    map[String(sub._id)] = []
    
  })

  notes.forEach(note => {
    const key = String(note.subjectId)
    if (map[key]) {
      map[key].push(note)
    }
  })


  return map
}, [usersubjects, notes])



useEffect(() => {
  gsap.fromTo(
    ".floating-title",
    {
      y: 0,
      x: 0,
    },
    {
      y: -7,
      x: 2,
      duration: 2.5,
      ease: "power1.inOut", 
      yoyo: true,
      repeat: -1,
      repeatDelay: 0.3, // ✨ Smooth pause before reversing
      yoyoEase: true,   // ✨ Smooth transition both ways
      stagger: 0.08
    }
  );
}, []);



const createNewNote=async(e)=>{
  e.preventDefault();
  try{
    const res=await axios.post(url+`/note/create/${clicksubject}`,{title:notetitle},{withCredentials:true})
    if(res.data){
      toast.success("Note Created Successfully")
      setnotetitle("");
      settogglenoteplus(false);
      getallnotes();
    }

  }
  catch(err){
    console.log(err)
  }
}
useEffect(() => {
  function handleClickOutside(e) {
    if (
      togglenoteplus &&
      clickoutsideRef.current &&
      !clickoutsideRef.current.contains(e.target)
    ) {
      settogglenoteplus(false);
      setnotetitle("");
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [togglenoteplus]);



  return (
    <div className="w-full min-h-screen flex gap-5 ">
      
      {/* LEFT PANEL */}
      <div className="w-[20%] min-h-screen flex flex-col pt-40 border-r overflow-y-auto">
        {userdata && usersubjects.map(sub => (
  <div
    key={sub._id}
    className="border w-full p-6 flex flex-col items-start justify-between cursor-pointer hover:bg-gray-700 relative"
    

  >
    <span className="text-[24px]" onClick={() => {
      if(clicksubject===sub._id){
        setclicksubject(null)
      }
      else{
        setclicksubject(sub._id)
        settogglenoteplus(false)
        setnotetitle("")
      }
      }}>{sub.name}</span>


    <span className="text-sm text-gray-500 absolute top-8 right-10">
      {notesBySubject[String(sub._id)]?.length || 0}
    </span>


    {clicksubject===sub._id && 
    (<div className='flex flex-col items-start justify-center mt-5'>
{notesBySubject[String(sub._id)]?.map(note => (
  <p className={`text-sm p-2 hover:text-amber-200 ${selectednote?._id===note._id?'text-amber-200' : ''}`} onClick={()=>setselectednote(note)}>{note.title}</p>
 

))}


<p onClick={()=>settogglenoteplus(prev=>!prev)} className='inline w-1 h-1 text-lg pb-3'>+</p>
{togglenoteplus && (
  <div className='fixed top-50 left-180 w-150 h-125 bg-white/10 border-white/20 rounded-2xl gap-7 backdrop-blur-md  flex items-center justify-center z-1000 border  flex-col ' ref={clickoutsideRef}>
    <h1 className='text-3xl'>Enter your note title</h1>
    <form onSubmit={createNewNote} className='w-[50%] h-[40%] flex flex-col items-start justify-center gap-5 '>
      <input type="text" placeholder='title' name='title' onChange={(e)=>setnotetitle(e.target.value)} value={notetitle} className='w-full pl-2 h-10 placeholder:p-3 border-2 rounded-md'/>
      <button type='submit' className='border w-30 h-10 rounded-xl cursor-pointer hover:bg-white hover:text-black'>Create</button>
    </form>

  </div>
)}
      
      </div>)}


  </div>
))}

      </div>

      {/* RIGHT PANEL */}
      <div className="w-[80%] pt-20 min-h-full">
        {selectednote? <Rightnote selectednote={selectednote} />:
        <div className='w-full h-[80%] flex items-center justify-center text-5xl font-semibold floating-title'>
          <p>Hello {userdata ? userdata?.name:"User"} ,Start your notes</p>
            
            </div>}
      </div>

    </div>
  )
}

export default Notepage
