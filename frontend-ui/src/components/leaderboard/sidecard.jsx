import React from 'react'
import { MdArrowOutward } from "react-icons/md";





function Sidecard({ me, avatarColor, loading }) {

  const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

    if (hours > 0) {
      return `${hours} h ${minutes} m ${secs} s`;
    }

    if (minutes > 0) {
      return `${minutes} m ${secs} s`;
    }

    return `${secs} s`;
  };
  

    const getAvatarColor = (name = "") => {
      let hash = 0;

      for (let i = 0; i < name.length; i++) {
          hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }

      const hue = hash % 360;

      return `hsla(${hue}, 70%, 60%, 0.25)`; // low opacity
    };
  


  return (
    <div className='h-auto font-poppins rounded-md w-85 -mr-20 min-w-0 mt-19.5 px-3 py-3 border-2 border-white/10 bg-whit flex flex-col gap-3 bg-white/2'>

      <div className='rounded-md  w-full h-41 p-3 flex flex-col items-center justify-center gap-2 bg-neutral-900 border-2 border-white/5 overflow-hidden truncate'>
        {loading ? (
          <>
            <div className='size-15 rounded-full bg-neutral-800 animate-pulse' />
            <div className='flex flex-col gap-2 items-center'>
              <div className='h-5 w-36 rounded-sm bg-neutral-800 animate-pulse' />
              <div className='h-7 w-52 rounded-full bg-neutral-800 animate-pulse' />
            </div>
          </>
        ) : (
          <>
            <div>
              {me?.picture ? (
                <img
                  src={me.picture}
                  alt={me.name}
                  className="size-15 rounded-full object-cover border border-white/10"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className='size-15 rounded-full  flex justify-center items-center font-semibold text-4xl'
                  style={{
                    backgroundColor: getAvatarColor(me?.name)
                  }}
                >
                  <p>{me?.name ? me.name[0].toUpperCase() : "?"}</p>
                </div>
              )}
            </div>
            <div className='flex flex-col gap-2 items-center'>
              <p className='text-xl font-semibold text-y truncate w-70 text-center '>{me?.name}</p>
              <p className='text-xs text-neutral-500 tracking-tight rounded-full bg-white/7 pr-3 pl-2 py-1 flex gap-1 items-center border border-white/10'>
              <MdArrowOutward className='size-4' />
              Top {me?.percentile}% in Timmo users </p>
            </div>
          </>
        )}
      </div>

      <div className='rounded-md w-full min-h-55 px-3 py-3 flex flex-col gap-1 justify-center bg-neutral-900 border-2 border-white/5'>

        <p className='tracking-tight  text-neutral-400 '>Today's summary</p>
      
        <div className='w-full min-h-45 grid grid-cols-2 gap-2 justify-center items-center mt-2'>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='rounded-sm h-full w-full px-3 flex justify-center flex-col gap-2 bg-white/5'>
                <div className='h-3 w-16 rounded-sm bg-neutral-800 animate-pulse' />
                <div className='h-5 w-20 rounded-sm bg-neutral-800 animate-pulse' />
                <div className='h-2 w-12 rounded-sm bg-neutral-800/70 animate-pulse' />
              </div>
            ))
          ) : (
            <>
              <div className='rounded-sm  h-full w-full px-3 flex justify-center flex-col bg-yellow-400/5'>
                <p className='text-white mb-0.5'>Rank</p>
                <p className='text-yellow-400 text-xl font-semibold'># {me?.rank}</p>
                <p className='text-neutral-500 text-xs '>Today</p>
              </div>

              <div className='rounded-sm h-full w-full px-3 flex justify-center flex-col bg-orange-400/5'>
                <p className='text-white mb-0.5 '>Streak</p>
                <p className='text-orange-400 text-xl font-semibold'>{me?.streak} days</p>
                <p className='text-neutral-500 text-xs '>Current</p>
              </div>

              <div className='rounded-sm h-full w-full px-3 flex justify-center flex-col bg-blue-400/7'>
                <p className='text-white mb-0.5'>Focus Time</p>
                <p className='text-blue-400 text-md font-semibold '>{formatTime(me?.todayTime)}</p>
                <p className='text-neutral-500 text-xs '>Today</p>
              </div>

              <div className='rounded-sm h-full w-full px-3 flex justify-center flex-col bg-green-500/5'>
                <p className='text-white mb-0.5'>Percentile</p>
                <p className='text-green-500 text-xl font-semibold'>{me?.percentile} %</p>
                <p className='text-neutral-500 text-xs '>Today</p>
              </div>
            </>
          )}

          
        </div>
        
      </div>



      <div className="relative h-40 overflow-hidden rounded-md border border-white/10 bg-neutral-900 p-5">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent" />

        <div className="absolute right-[-15px] bottom-[-14px]">
          <img
            src="/earth.webp"
            alt=""
            className="w-43 opacity-50 mask-l-from-40% mask-b-from-50%  grayscale"
          />
        </div>

        <div className="relative z-10">
          <p className="text-sm text-neutral-500">
            You vs The World
          </p>

          {loading ? (
            <>
              <div className='mt-4 h-12 w-24 rounded-sm bg-neutral-800 animate-pulse' />
              <div className='mt-4 flex flex-col gap-2'>
                <div className='h-3 w-[170px] rounded-sm bg-neutral-800 animate-pulse' />
                <div className='h-3 w-32 rounded-sm bg-neutral-800 animate-pulse' />
              </div>
            </>
          ) : (
            <>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-5xl font-bold text-white">
                  {me?.focusedMoreThan}
                </span>
                <span className="mb-1 text-2xl font-semibold text-neutral-500">
                  %
                </span>
              </div>

              <p className="mt-2 w-[170px] text-sm text-neutral-400">
                Focused more than {me?.focusedMoreThan}% of users today.
              </p>
            </>
          )}
        </div>
      </div>

    </div>
  )
}

export default Sidecard
