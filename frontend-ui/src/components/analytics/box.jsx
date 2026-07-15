import React from 'react'

function Box({ boxData }) {
  return (
    <div className='group min-h-34 rounded-lg border border-white/10 bg-neutral-800/30 p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition duration-200  hover:border-white/13 hover:bg-neutral-800/40'>
      <p className='font-poppins text-sm  tracking-[0.1em] text-neutral-500'>{boxData.title}</p>
      <p className='mt-3 font-poppins text-3xl font-semibold tracking-normal text-white'>{boxData.time}</p>
    </div>
  )
}

export default Box
