import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import Rightnote from './Rightnote'
import { notecontext } from '../context/Context'
import {gsap} from 'gsap'
import axios from 'axios'
import { toast } from 'react-toastify'
import { MessageCircleMore } from 'lucide-react';
import Chatbox from '../components/Chatbox'
import { io } from 'socket.io-client'
import { Trash } from 'lucide-react';
const Notepage = () => {
  const {
    userdata,
    usersubjects,
    getallusersubjects,
    notes,url,
    getallnotes,
    getallusers,allusers,socket
  } = useContext(notecontext)

  const [clicksubject, setclicksubject]=useState(null);
  const [selectednote, setselectednote]=useState(null)
  const [togglenoteplus,settogglenoteplus]=useState(false)
  const [notetitle,setnotetitle]=useState("")
  const clickoutsideRef=useRef(null);

  //add subject or create a new subject

  const [createSubclick,setcreateSubclick]=useState(false);
  const [subname,setsubname]=useState("")
  const createsubref= useRef(null)

  //add or create group
  const [creategroupclick,setcreategroupclick]=useState(false);
  const [groupdata,setgroupdata]=useState({
    name:"",
    members:[],
  })
  const creategrpref=useRef(null)
  const [useripname,setuseripname]=useState("")
  const [allgroups,setallgroups]=useState([])

  
console.log(groupdata.members)
  const addMember=(user)=>{
    setgroupdata((prev)=>{
      if (prev.members.some(m => String(m._id) === String(user._id))) return prev;


      return {
        ...prev,
        members:[...prev.members,user]
      }
    })
     setuseripname("")
  }
  const removeMember=(user)=>{
    setgroupdata((prev)=>{
      return{
        ...prev,
        members:prev.members.filter(m=>m._id!==user._id)
      }
    })
    setuseripname("")
  }


  //create a colab

  const createColab=async(e)=>{
    e.preventDefault();
    try{
      const res=await axios.post(url+`/group/create`,{name:groupdata.name,members:groupdata.members.map(m=>m._id)},{withCredentials:true})
      if(res.data){
        toast.success("New colab created");
        setuseripname("")
        setcreategroupclick(false);
        getallusergroups()
        setgroupdata({
          name:"",
          members:[],

        })
      }
    }
    catch(err){
      console.log(err)
    }
  }



  //get all user groups 
console.log(allgroups)
  const getallusergroups=async()=>{
    try{
      const res=await axios.get(url+`/group/getall`,{withCredentials:true})
      if(res.data){
       setallgroups(res.data)
       
      }
    }
    catch(err){
      console.log(err)
    }

  }

  




  useEffect(()=>{
    if(!userdata) return;

    getallusers()
    getallusergroups()

  },[userdata])


  //
  useEffect(() => {
    if (!userdata) return

    const runthis = async () => {
      await getallusersubjects()
      await getallnotes()
      await getallusers()
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

const createNewgrpNote=async(e)=>{
  e.preventDefault();
  try{
    const res=await axios.post(url+`/note/create/${clickgrpsubject}`,{title:notetitle},{withCredentials:true})
    if(res.data){
      toast.success("Note Created Successfully")
      setnotetitle("");
      settogglenoteplus(false);
      getallnotes();
      setGrpNoteOpen(false)
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

useEffect(() => {
  function handleClickOutside(e) {
    if (
      creategroupclick &&
      creategrpref.current &&
      !creategrpref.current.contains(e.target)
    ) {
      
      setgroupdata({
        name:"",
        members:[],
      })
      setuseripname("")
      setcreategroupclick(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [creategroupclick]);

//create sub click outside ref
const createAnewSubject=async(e)=>{
  e.preventDefault()
   try{
    const res=await axios.post(url+`/sub/create`,{name:subname},{withCredentials:true})
    if(res.data){
      toast.success("Subject Created Successfully")
      
      setcreateSubclick(false);
      setsubname("");
      getallusersubjects();
    }

  }
 
  catch(err){
    console.log(err)
  }

}
//create a new grp subject
const createAnewgrpSubject = async (e) => {
  e.preventDefault();

  console.log("SENDING GROUP ID:", currentgroup?._id);

  const res = await axios.post(
    url + "/sub/gcreate",
    {
      name: subname,
      groupId: currentgroup._id   
    },
    { withCredentials: true }
  );

  setcreategrpsubclick(false);
  setsubname("");
  getallsubjectsbygroup();
};


useEffect(() => {
  function handleClickOutside(e) {
    if (
      createSubclick &&
      createsubref.current &&
      !createsubref.current.contains(e.target)
    ) {
      setcreateSubclick(false);
      setsubname("");
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [createSubclick]);





// entiurely for group/colab fuctionality 


const [grpsubjects,setgrpsubjects]=useState([])
const [currentgroup,setcurrentgroup]=useState(null)
const [creategrpsubclick,setcreategrpsubclick]=useState(false)
const createsubref1= useRef(null)
const [clickgrpsubject,setclickgrpsubject]=useState(null);
const grpClickRef = useRef(null);
const [grpNoteOpen, setGrpNoteOpen] = useState(false);


const [clickchaticon,setclickchaticon]=useState(false)
const iconref=useRef(null)




const getallsubjectsbygroup=async()=>{
  try{
    const res=await axios.post(url+'/sub/getallbygrp',{groupid:currentgroup._id},{withCredentials:true})
    if(res.data){
      setgrpsubjects(res.data)


    }

  }
  catch(err){
    console.log(err)
  }
}
console.log(grpsubjects)
useEffect(() => {
  if (!currentgroup) return;   
  getallsubjectsbygroup();
}, [currentgroup]);

useEffect(() => {
  function handleClickOutside(e) {
    if (
      creategrpsubclick &&
      createsubref1.current &&
      !createsubref1.current.contains(e.target)
    ) {
      setcreategrpsubclick(false);
      setsubname("");
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [creategrpsubclick]);


const notesbygrpsubject=useMemo(()=>{
  if(!grpsubjects || !notes) return {}

  const map={};

  grpsubjects.map(sub=>{
    map[String(sub._id)]=[];
  })

  notes.map(note=>{
    const key=String(note.subjectId);
    if(map[key]){
      map[key].push(note);
    }
  })

  return map;
},[grpsubjects,notes])

useEffect(() => {
  function handleClickOutside(e) {
    if (
      grpNoteOpen &&
      grpClickRef.current &&
      !grpClickRef.current.contains(e.target)
    ) {
      setGrpNoteOpen(false)
      setnotetitle("")
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [grpNoteOpen]);


 useEffect(()=>{
  function handleClickOutside(e) {
  if(clickchaticon && 
    iconref.current && 
    !iconref.current.contains(e.target)
  ){
    setclickchaticon(false);


  }
}

document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);


 },[clickchaticon])








 //deletion part completely


 const deleteSubject=async(subid)=>{
  try{
    const res=await axios.post(url+'/sub/delsub',{subjectId:subid},{withCredentials:true});
    if(res.data){
      
      getallusersubjects()
      getallnotes()
    }

  }
  catch(err){
    console.log(err)
  }
 }
  const deletegroupSubject=async(subid)=>{
  try{
    const res=await axios.post(url+`/sub/delgrpsub/${currentgroup._id}`,{subjectId:subid},{withCredentials:true});
    if(res.data){
      
      getallsubjectsbygroup()
      getallnotes()
    }

  }
  catch(err){
    console.log(err)
  }
 }
 //for listening to backedn sub delted event

useEffect(() => {
  if (!socket) return;

 const handleGrpSubDeleted = ({ subjectId, name }) => {
  toast.info(`a sub named ${name} was recently deleted`);

  // 🔥 remove subject immediately
  setgrpsubjects(prev =>
    prev.filter(sub => sub._id !== subjectId)
  );
};


  const handleGroupDeleted = (grp) => {
  toast.info(`${grp.name} was deleted`);

setcurrentgroup(null);
  setgrpsubjects([]);
  setclickchaticon(false);
  getallusergroups();
  
};


  socket.on("grpsubdeleted", handleGrpSubDeleted);
  socket.on("groupDeleted", handleGroupDeleted);

  return () => {
    socket.off("grpsubdeleted", handleGrpSubDeleted);
    socket.off("groupDeleted", handleGroupDeleted);
  };
}, [socket]);


useEffect(()=>{
  
  getallusergroups()
},[userdata])

 //delete group
 const deleteGroup=async()=>{
  try{
const res=await axios.post(url+"/group/delete",{groupId:currentgroup._id},{withCredentials:true});
    if(res.data){
      
      getallusergroups();
      
    }
  }
  catch(err){
    console.log(err)
  }
 }


  return (
    <div className="w-full h-[calc(100vh-80px)] flex gap-5 relative overflow-hidden">
      {
        createSubclick && (
           
         <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-1000">
  <div className="w-105  max-w-[90%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-white animate-fadeIn" ref={createsubref}>

    <h1 className="text-2xl font-bold mb-6 text-center">
      Create a New Subject
    </h1>

    <form className="w-full  flex flex-col gap-6" onSubmit={createAnewSubject}>

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm text-gray-300">
          Subject Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={subname}
          onChange={(e)=>setsubname(e.target.value)}
          placeholder="Enter subject name"
          className="w-full h-11 px-4 rounded-lg bg-black/30 border border-white/20 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 transition"
        />
      </div>

      <button
        type="submit"
        className="h-11 rounded-xl bg-white text-black font-semibold tracking-wide hover:bg-gray-200 transition-all active:scale-95 shadow-md"
      >
        Create Subject
      </button>

    </form>
  </div>
</div>

        )
      }

{/* functionality for group chat*/}
      {clickchaticon && (
        <div className='fixed inset-0   z-1000 flex items-end justify-end'>

          <div className='w-200 mb-10 h-70 bg-white/70 backdrop-blur-2xl' ref={iconref}>

          <Chatbox groupId={currentgroup._id}/>



          </div>







        </div>

      )}

      {/* create a new note*/ }
      {togglenoteplus && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div
      ref={clickoutsideRef}
      onClick={(e) => e.stopPropagation()}
      className="w-96 bg-white text-black p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-lg font-semibold mb-4">
        Create Note
      </h2>

      <form
        onSubmit={createNewNote}
        className="flex flex-col gap-3"
      >
        <input
          type="text"
          value={notetitle}
          onChange={(e) => setnotetitle(e.target.value)}
          placeholder="Note title"
          autoFocus
          required
          className="border p-2 rounded outline-none focus:ring-2 focus:ring-black"
        />

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => {
              settogglenoteplus(false);
              setnotetitle("");
            }}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{/*new grp note*/}
      {grpNoteOpen && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div
      ref={grpClickRef}
      onClick={(e) => e.stopPropagation()}
      className="w-96 bg-white text-black p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-lg font-semibold mb-4">
        Create Note
      </h2>

      <form
        onSubmit={createNewgrpNote}
        className="flex flex-col gap-3"
      >
        <input
          type="text"
          value={notetitle}
          onChange={(e) => setnotetitle(e.target.value)}
          placeholder="Note title"
          autoFocus
          required
          className="border p-2 rounded outline-none focus:ring-2 focus:ring-black"
        />

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => {
              settogglenoteplus(false);
              setnotetitle("");
            }}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
)}


{creategroupclick && (
  <div
    className="fixed inset-0 bg-black/60 flex items-center justify-center z-999"
    onClick={() => setcreategroupclick(false)}
  >
    <div
      ref={creategrpref}
      onClick={(e) => e.stopPropagation()}
      className="w-105 max-h-[80vh] bg-white p-6 rounded-lg flex flex-col gap-4"
    >
      <h2 className="text-xl font-semibold text-black">
        Create Colab
      </h2>

      {/* GROUP NAME */}
      <input
        type="text"
        placeholder="Group name"
        value={groupdata.name}
        onChange={(e) =>
          setgroupdata(prev => ({ ...prev, name: e.target.value }))
        }
        className="border p-2 rounded text-black"
      />

      {/* SEARCH USERS */}
      <input
        type="text"
        placeholder="Search users"
        value={useripname}
        onChange={(e) => setuseripname(e.target.value)}
        className="border p-2 rounded text-black"
      />

      {/* USERS LIST */}
      <div className="flex-1 overflow-y-auto border rounded p-2 flex flex-col gap-1">
        {allusers.filter(u=>u._id!==userdata._id)
          .filter(u =>
            u.name.toLowerCase().includes(useripname.toLowerCase())
          )
          .map(user => {
            const selected = groupdata.members.some(
              m => String(m._id) === String(user._id)
            );

            return (
              <div
                key={user._id}
                onClick={() =>
                  selected ? removeMember(user) : addMember(user)
                }
                className={`p-2 rounded cursor-pointer transition
                  ${
                    selected
                      ? "bg-green-500 text-white"
                      : "hover:bg-gray-200 text-black"
                  }
                `}
              >
                {user.name}
              </div>
            );
          })}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2">
        <button
          onClick={() => setcreategroupclick(false)}
          className="flex-1 border py-2 rounded text-black"
        >
          Cancel
        </button>

        <button
          onClick={createColab}
          className="flex-1 bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Create Group
        </button>
      </div>
    </div>
  </div>
)}


      {/* group subject create */}

       {
        creategrpsubclick && (
           
         <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-1000">
  <div className="w-105  max-w-[90%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-white animate-fadeIn" ref={createsubref1}>

    <h1 className="text-2xl font-bold mb-6 text-center">
      Create a New Subject
    </h1>

    <form className="w-full  flex flex-col gap-6" onSubmit={createAnewgrpSubject}>

      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm text-gray-300">
          Subject Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={subname}
          onChange={(e)=>setsubname(e.target.value)}
          placeholder="Enter subject name"
          className="w-full h-11 px-4 rounded-lg bg-black/30 border border-white/20 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 transition"
        />
      </div>

      <button
        type="submit"
        className="h-11 rounded-xl bg-white text-black font-semibold tracking-wide hover:bg-gray-200 transition-all active:scale-95 shadow-md"
      >
        Create Subject
      </button>

    </form>
  </div>
</div>

        )
      }
      
      {/* LEFT PANEL */}
      <div className="w-[20%] h-full flex flex-col border-r pr-4 gap-3 pt-20">

  <div className="w-full h-1/2 flex flex-col overflow-y-auto gap-2">

    <button
      className="w-32 text-sm cursor-pointer bg-green-700 hover:bg-green-500 h-9 rounded-md border transition"
      onClick={() => setcreateSubclick(prev => !prev)}
    >
      + Add subject
    </button>

    {userdata && usersubjects.map(sub => (
      <div
        key={sub._id}
        className="border rounded-md w-full p-4 flex flex-col gap-1 cursor-pointer hover:bg-gray-800 transition relative"
      >

        {/* SUBJECT HEADER */}
        <div
          className=" w-full flex items-center justify-between"
        
        >
          <span className="w-[80%] text-base font-medium truncate " onClick={() => {
            if (clicksubject === sub._id) {
              setclicksubject(null)
            } else {
              setclicksubject(sub._id)
              settogglenoteplus(false)
              setnotetitle("")
            }
          }}>{sub.name}</span>

          <div className='w-[20%] flex items-center justify-between'>
          <Trash className='w-4 h-4 hover:scale-[1.06]' onClick={()=>deleteSubject(sub._id)}/>
          <span className="text-xs text-gray-400">
            {notesBySubject[String(sub._id)]?.length || 0}
          </span>
          </div>
        </div>

        {/* SUBJECT NOTES */}
        {clicksubject === sub._id && (
          <div className="ml-3 mt-2 flex flex-col gap-1">

            <p
              onClick={() => settogglenoteplus(true)}
              className="text-xs text-green-400 cursor-pointer hover:underline w-fit"
            >
              + Add note
            </p>

            {notesBySubject[String(sub._id)]?.map(note => (
              <p
                key={note._id}
                onClick={() => setselectednote(note)}
                className={`text-xs px-2 py-1 rounded-md cursor-pointer transition ${
                  selectednote?._id === note._id
                    ? "text-amber-300 bg-gray-800"
                    : "hover:text-amber-200 hover:bg-gray-800"
                }`}
              >
                {note.title}
              </p>
            ))}
          </div>
        )}
      </div>
    ))}

  </div>


{/* groups feature list all groups */}


      <div className="w-full h-1/2 flex flex-col mt-6 pr-4 gap-3 border-t pt-3">

  <p
    onClick={() => setcreategroupclick(prev => !prev)}
    className="text-sm border w-32 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition"
  >
    + Create Colab
  </p>

  {/* GROUP LIST */}
  <div className="w-full flex-1 overflow-y-auto flex flex-col gap-2 p-2">

    {allgroups.map(gr => (
      <div key={gr._id} className="w-full border rounded-md">

        {/* GROUP HEADER */}
        <div className='w-full h-10 flex items-center justify-center px-3  hover:bg-gray-700 transition '>
        <div
          className="w-[80%] h-10 cursor-pointer flex items-center"
         
        >
          <p className=" w-full text-base font-medium"  onClick={() =>
            setcurrentgroup(currentgroup?._id === gr._id ? null : gr)
          }>{gr.name}</p>
          
        </div>
<div className='w-[20%] flex items-center justify-center'>
        {currentgroup?._id===gr._id && (
          <div className='w-full flex items-center justify-between'>
            <Trash className='w-4 h-4 cursor-pointer' onClick={deleteGroup}/>
          <MessageCircleMore  className='w-4 h-4 cursor-pointer' onClick={()=>setclickchaticon(prev=>!prev)}/>
            
            </div>)}
</div>
        </div>

        {/* GROUP EXPAND */}
        {currentgroup?._id === gr._id && (
          <div className="ml-4 mt-2 flex flex-col gap-2 p-3">

            <p
              className="cursor-pointer text-xs text-blue-400 hover:underline w-fit"
              onClick={() => setcreategrpsubclick(prev => !prev)}
            >
              + Add Subject
            </p>

            {/* SUBJECT LIST */}
            {grpsubjects.map(sub => (
              <div
                key={sub._id}
                className="w-full text-sm pl-2 border-l border-gray-600 hover:bg-gray-800 rounded-md"
              >

                {/* SUBJECT HEADER */}
                <div
                  className="w-full flex items-center justify-between p-2 "
                 
                >
                  <p className="text-sm font-medium truncate w-[80%] cursor-pointer"  onClick={() =>
                    setclickgrpsubject(
                      clickgrpsubject === sub._id ? null : sub._id
                    )
                  }>{sub.name}</p>

                  <div className='w-[20%] flex items-center justify-between'>
                    <Trash  className='w-3 h-3 hover:scale-[1.05] cursor-pointer' onClick={()=>deletegroupSubject(sub._id)}/>
                  <span className="text-xs text-gray-400">
                    {notesbygrpsubject[String(sub._id)]?.length || 0}
                  </span>
                  </div>
                </div>

                {/* SUBJECT NOTES */}
                {clickgrpsubject === sub._id && (
                  <div className="ml-3 mb-2 flex flex-col gap-1">

                    <p
                      onClick={() => setGrpNoteOpen(true)}
                      className="text-xs text-green-400 cursor-pointer hover:underline w-fit"
                    >
                      + Add note
                    </p>

                    {notesbygrpsubject[String(sub._id)]?.map(note => (
                      <p
                        key={note._id}
                        onClick={() => setselectednote(note)}
                        className={`text-xs px-2 py-1 rounded-md cursor-pointer transition ${
                          selectednote?._id === note._id
                            ? "text-amber-300 bg-gray-800"
                            : "hover:text-amber-200 hover:bg-gray-800"
                        }`}
                      >
                        {note.title}
                      </p>
                    ))}

                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
</div>


      </div>











      {/* RIGHT PANEL */}
      <div className="w-[80%] pt-20 min-h-full">
        {selectednote? <Rightnote selectednote={selectednote}/>:
          <p className=' w-full h-[80%] flex items-center justify-center floating-title text-5xl'>Hello {userdata ? userdata?.name:"User"} ,Start your notes</p>
          }
            
            

            
      </div>

    </div>
  )
}

export default Notepage
