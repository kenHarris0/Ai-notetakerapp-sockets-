import React, { useContext, useEffect, useRef, useState } from 'react'
import { notecontext } from '../context/Context'
import axios from 'axios'

const Chatbox = ({ groupId }) => {
  const {
    userdata,
    groupMessages,
    getallmessages,
    url,socket,activeGroupId, setActiveGroupId,setgroupMessages
  } = useContext(notecontext)

  const gotoendref = useRef(null)
  const [userip, setuserip] = useState("")

  useEffect(() => {
    if (!userdata || !groupId) return
    getallmessages(groupId)
  }, [groupId])

  useEffect(() => {
  return () => {
    setgroupMessages([]); // clear previous group's messages
  };
}, [groupId]);



  useEffect(() => {
  if (!socket || !groupId) return;

  socket.emit("joingroup", groupId);

  return () => {
    socket.emit("leavegroup", groupId);
  };
}, [socket, groupId]);




  const sendMessage = async (e) => {
    e.preventDefault()
    if (!userip.trim()) return

    try {
      await axios.post(
        `${url}/msg/create/${groupId}`,
        { data: userip },
        { withCredentials: true }
      )
      setuserip("")
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    gotoendref.current?.scrollIntoView({ behavior: "smooth" })
  }, [groupMessages])

  return (
    <div className="w-full h-full flex flex-col bg-[#0f172a] rounded-lg overflow-hidden">

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-600">
        {groupMessages.map((message) => {
          const isSender = message.senderId?._id === userdata?._id

          return (
            <div
              key={message._id}
              className={`chat ${isSender ? "chat-end" : "chat-start"}`}
            >
              <div
                className={`chat-bubble max-w-[75%] ${
                  isSender
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-100"
                }`}
              >
                {!isSender && (
                  <p className="text-[10px] mb-1 text-yellow-300">
                    {message.senderId?.name}
                  </p>
                )}
                <p className="text-sm leading-relaxed">
                  {message.data}
                </p>
              </div>
            </div>
          )
        })}

        <div ref={gotoendref} />
      </div>

      {/* INPUT AREA */}
      <form
        onSubmit={sendMessage}
        className="h-16 flex items-center gap-2 px-3 border-t border-gray-700 bg-[#020617]"
      >
        <input
          type="text"
          placeholder="Type a message…"
          value={userip}
          onChange={(e) => setuserip(e.target.value)}
          className="flex-1 h-10 rounded-lg px-3 text-sm bg-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 transition text-sm font-medium text-white"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default Chatbox
