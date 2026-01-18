import React from 'react'
import Rightnote from './Rightnote'

const Notepage = () => {
  return (
    <div className='w-full h-screen flex '>

      <div className='w-[30%] h-full flex flex-col items-center justify-start mt-40 border-2'>
        <p className='border w-full p-6 h-10 flex items-center justify-center text-[30px] cursor-pointer'>SCIENCE</p>
        <p className='border w-full p-6 h-10 flex items-center justify-center text-[30px] cursor-pointer'>History</p>

      </div>

      <div>
        <Rightnote/>
      </div>
      
    </div>
  )
}

export default Notepage
