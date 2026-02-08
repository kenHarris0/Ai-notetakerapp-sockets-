import React from 'react'
import Navbar from './components/Navbar'
import {Routes,Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Notepage from './pages/Notepage.jsx'
import Login from './pages/Login.jsx'
import { ToastContainer } from 'react-toastify'
import Groupinfo from './pages/Groupinfo.jsx'

const App = () => {
  return (
    
    <div className='w-[90%] m-auto h-screen flex flex-col items-center justify-center text-white bg-black relative'>
      <Navbar/>
       
<ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
         <Route path='/notepg' element={<Notepage/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/group/:id' element={<Groupinfo/>}/>


        
      </Routes>
      
     
      
    </div>
  )
}

export default App
