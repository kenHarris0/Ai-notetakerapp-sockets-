import React from 'react'
import {gsap} from 'gsap'
import SplitType from "split-type";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navv=useNavigate();
    useEffect(() => {
    const text = new SplitType(".color-train", { types: "chars" });

    gsap.fromTo(text.chars,
      { color: "#777" },      // default color
      {
        color: "#00C9A7",     // bright teal passing
        duration: 0.4,
        repeat: -1,
        yoyo: true,
        repeatDelay:2,
        stagger: 0.15,        // ← moves like a train!
        ease: "back.inOut",
      }
    );
  }, []);

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


  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>

        <h1 className='text-white text-[180px] color-train floating-title -mt-7.5'>Welcome User To NOTELM,</h1>
        <h3 className='text-white text-[70px]  '>Colab + AI Note Taking App</h3>     
        <button className='mt-10 text-lg  p-2 rounded cursor-pointer hoveranimation' onClick={()=>navv('/notepg')}>Get Started</button> 
    </div>
  )
}

export default Home
