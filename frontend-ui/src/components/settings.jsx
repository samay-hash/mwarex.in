import React, { useState } from 'react'
import { useOutletContext } from "react-router";
import { TbCropPortrait } from "react-icons/tb";

function Settings() {



  const handleSidebar = (id) => {
    setSidebarOpt(id)
  }

  const { sidebarOpt, setSidebarOpt } = useOutletContext();
  const { outsideClick, setOutsideClick } = useOutletContext();
  const { timeDisplay,setTimeDisplay } = useOutletContext();
  const { timeFormat, setTimeFormat } = useOutletContext();
  const { textColor, setTextColor } = useOutletContext();
  const { showSeconds , setShowSeconds } = useOutletContext();
  


  const handleTextCOlor = (id) => {
    setTextColor(id)
  }


  return (
    <div className='h-screen w-screen min-w-0 overflow-y-auto bg-neutral-900 px-4 py-6 text-white sm:px-6 lg:px-10 flex flex-col items-center' 
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "gray transparent",
    }}>

      <div className='w-full max-w-7xl min-w-0 items-center flex flex-col gap-6'>

        <div className='flex w-full min-w-0 flex-col gap-2 border-b border-white/10 pb-5'>
          <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-end'>
            <h1 className='font-poppins text-3xl font-semibold tracking-normal text-white sm:text-4xl'>
              Settings
            </h1>
          </div>
        </div>

        

          <div className='w-full rounded-md bg-neutral-800/50 py-5 px-4 border-2 border-white/5 justify-between flex flex-col gap-5 sm:px-6 xl:flex-row'>
            <div className='flex flex-col gap-2 xl:w-64 xl:shrink-0'>
                <p className='font-poppins text-xl'>Sidebar Mode</p>
                <p className='font-poppins text-sm text-neutral-500 max-w-60 tracking-tight'>Choose how you want to open and close the sidebar.</p>

            </div>

            <div className='grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3'>

              <div onClick={() => handleSidebar("manual")} className={`min-h-35 rounded-md border-2 cursor-pointer hover:bg-neutral-800 transition-all duration-200 p-4 flex gap-4 font-poppins justify-center 
               ${sidebarOpt === "manual" ? "border-white bg-neutral-800" : " border-white/5 "} `}>
                <div>
                  <div
                    className={`size-7 rounded-full border-2 flex items-center justify-center
                      ${sidebarOpt === "manual"
                        ? "border-white"
                        : "border-neutral-700"}
                    `}
                  >
                    {sidebarOpt === "manual" && (
                      <div className="size-3 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  <div>
                    <p>Manual</p>
                  </div>
                  <div>
                    <p className='text-neutral-500 text-sm tracking-tight'>Open and close the sidebar manually using the toggle button.</p>
                  </div>
                </div>
              </div>

              <div  onClick={() => handleSidebar("hover")} className={`min-h-35 rounded-md border-2 cursor-pointer hover:bg-neutral-800 transition-all duration-200 p-4 flex gap-4 font-poppins justify-center 
               ${sidebarOpt === "hover" ? "border-white bg-neutral-800" : " border-white/5 "} `}>
                <div>
                  <div
                    className={`size-7 rounded-full border-2 flex items-center justify-center
                      ${sidebarOpt === "hover"
                        ? "border-white"
                        : "border-neutral-700"}
                    `}
                  >
                    {sidebarOpt === "hover" && (
                      <div className="size-3 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  <div>
                    <p className='flex items-center gap-2'>Hover <span className='px-2 py-0.5 rounded-full bg-neutral-700 text-xs text-neutral-300 '>Desktop</span> </p>
                  </div>
                  <div>
                    <p className='text-neutral-500 text-sm tracking-tight'>Hover on the left edge of the screen to open the sidebar.</p>
                  </div>
                </div>
              </div>

              <div  onClick={() => handleSidebar("mix")} className={`min-h-35 rounded-md border-2 cursor-pointer hover:bg-neutral-800 transition-all duration-200 p-4 flex gap-4 font-poppins justify-center sm:col-span-2 xl:col-span-1 
               ${sidebarOpt === "mix" ? "border-white bg-neutral-800" : " border-white/5 "} `}>
                <div>
                  <div
                    className={`size-7 rounded-full border-2 flex items-center justify-center
                      ${sidebarOpt === "mix"
                        ? "border-white"
                        : "border-neutral-700"}
                    `}
                  >
                    {sidebarOpt === "mix" && (
                      <div className="size-3 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  <div>
                     <p className='flex items-center gap-2'>Mix <span className='px-2 py-0.5 rounded-full bg-neutral-700 text-xs text-neutral-300 '>Desktop</span> </p>
                  </div>
                  <div>
                    <p className='text-neutral-500 text-sm tracking-tight '>Use both hover to open and manual toggle to close.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>


          <div className='w-full rounded-md bg-neutral-800/50 py-5 px-4 border-2 border-white/5 justify-between flex flex-col gap-5 sm:px-6 xl:flex-row'>
            <div className='flex flex-col gap-2 xl:w-64 xl:shrink-0'>
                <p className='font-poppins text-xl'>Sidebar Behavior</p>
                <p className='font-poppins text-sm text-neutral-500 max-w-60 tracking-tight'>Additional sidebar preferences.</p>

            </div>

              <div className='rounded-md border-2 border-white/5 w-full min-w-0 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5'>
                    <div className='flex min-w-0 flex-col gap-2'>
                      <p className='font-poppins'>Close sidebar on outside click</p>
                      <p className='text-sm text-neutral-500 font-poppins tracking-tight'>Click anywhere outside the sidebar to close it.</p>
                    </div>

                    <div onClick={() => setOutsideClick(!outsideClick)}>
                      <div className={`relative duration-200 cursor-pointer rounded-full  w-15 h-8 flex p-1 items-center transition-all  ${outsideClick ? " bg-white " : " bg-neutral-700  "}`}>
                        <div className={` absolute size-6 rounded-full top-1  transition-transform duration-300 ease-in-out ${outsideClick ? "bg-black translate-x-7" : "bg-white  translate-x-0"}`}>

                        </div>
                      </div>
                    </div>
              </div>
            
          </div>


          <div className='w-full rounded-md bg-neutral-800/50 py-5 px-4 border-2 border-white/5 justify-between flex flex-col gap-5 sm:px-6 xl:flex-row'>
            <div className='flex flex-col gap-2 xl:w-64 xl:shrink-0'>
                <p className='font-poppins text-xl'>Time Display</p>
                <p className='font-poppins text-sm text-neutral-500 max-w-60 tracking-tight'>Choose how time is displyaed across the app.</p>

            </div>

            <div className='rounded-md border-2 border-white/5 w-full min-w-0 flex flex-col gap-2 items-center justify-between'>
                  
              <div className='w-full px-4 pt-4 pb-3 flex flex-col gap-4 justify-between sm:px-5 lg:flex-row lg:items-center'>
                <div className='flex min-w-0 flex-col gap-1'>
                    <p className='font-poppins'>Clock Orientation</p>
                    <p className='font-poppins text-sm text-neutral-500 '>Select the preferred time layout.</p>
                </div>

                <div className='grid w-full grid-cols-1 gap-3 font-poppins sm:grid-cols-2 lg:w-auto'>
                    <div onClick={() =>setTimeDisplay(true)} className={`rounded-md flex justify-center items-center cursor-pointer hover:bg-neutral-800/50 transition-all duration-200 h-15 gap-3 px-4 lg:w-40 ${ timeDisplay ? "bg-neutral-800/50 border-white border" : " border-white/5 border-2"}`}>
                      <div className={`w-8 h-5 border-2 rounded-sm transition-all duration-200  ${timeDisplay ? "bg-white/10" : ""} `}/>
                      <p>Horizontal</p>
                    </div>
                    <div onClick={() =>setTimeDisplay(false)} className={`rounded-md flex justify-center items-center cursor-pointer hover:bg-neutral-800/50 transition-all duration-200 h-15 gap-1.5 px-4 lg:w-40 ${ !timeDisplay ? "bg-neutral-800/50 border-white border" : " border-2 border-white/5"}`}>
                      <div className={`w-8 h-5 border-2 rounded-sm rotate-90 transition-all duration-200   ${!timeDisplay ? "bg-white/10" : ""} `}/>

                      <p>Verticle</p>
                    </div>
                </div>
                
              </div>

              <div className='w-full border border-white/5 ' />


              <div className='w-full px-4 py-3 flex flex-col gap-4 justify-between sm:px-5 lg:flex-row lg:items-center'>
                <div className='flex min-w-0 flex-col gap-1 justify-center'>
                    <p className='font-poppins'>Time Format</p>
                    <p className='font-poppins text-sm text-neutral-500 '>choose your preferred time format.</p>
                </div>

                <div className='grid w-full grid-cols-1 gap-3 font-poppins sm:grid-cols-2 lg:w-auto'>
                    <div onClick={() =>setTimeFormat(true)} className={`rounded-md flex justify-around px-5 items-center cursor-pointer hover:bg-neutral-800/50 transition-all duration-200 min-h-15 gap-3 lg:w-40 ${ timeFormat ? "bg-neutral-800/50 border-white border" : " border-white/5 border-2"}`}>
                      
                      <div>
                        <div
                          className={`size-7 rounded-full border-2 flex items-center justify-center
                            ${timeFormat
                              ? "border-white"
                              : "border-neutral-700"}
                          `}
                        >
                          {timeFormat && (
                            <div className="size-3 rounded-full bg-white" />
                          )}
                        </div>
                      </div>

                        <div className='flex flex-col '>
                          <p>12 Hour</p>
                          <p className='text-sm text-neutral-500'>AM/PM</p>
                        </div>
                      
                    </div>
                    <div onClick={() =>setTimeFormat(false)} className={`rounded-md flex justify-around px-5 items-center cursor-pointer hover:bg-neutral-800/50 transition-all duration-200 min-h-15 gap-1.5 lg:w-40 ${ !timeFormat ? "bg-neutral-800/50 border-white border" : " border-2 border-white/5"}`}>
                      
                      <div>
                        <div
                          className={`size-7 rounded-full border-2 flex items-center justify-center
                            ${!timeFormat
                              ? "border-white"
                              : "border-neutral-700"}
                          `}
                        >
                          {!timeFormat && (
                            <div className="size-3 rounded-full bg-white" />
                          )}
                        </div>
                      </div>

                      <div className='flex flex-col '>
                        <p>24 Hour</p>
                        <p className='text-sm text-neutral-500'>13:45</p>
                      </div>
                    </div>
                </div>
              </div>   

              
              <div className='w-full border border-white/5 ' />


              <div className='rounded-md w-full min-w-0 flex flex-col gap-4 justify-between px-4 py-4 sm:px-5 sm:flex-row sm:items-center'>
                    <div className='flex min-w-0 flex-col gap-2'>
                      <p className='font-poppins'>Show Seconds</p>
                      <p className='text-sm text-neutral-500 font-poppins tracking-tight'>Include seconds in the clock display. (Horizontal mode only)</p>
                    </div>

                    <div onClick={() => setShowSeconds(!showSeconds)}>
                      <div className={`relative duration-200 cursor-pointer rounded-full  w-15 h-8 flex p-1 items-center transition-all  ${showSeconds ? " bg-white " : " bg-neutral-700  "}`}>
                        <div className={` absolute size-6 rounded-full top-1  transition-transform duration-300 ease-in-out ${showSeconds ? "bg-black translate-x-7" : "bg-white  translate-x-0"}`}>

                        </div>
                      </div>
                    </div>
              </div>

                    
            </div>
            
          </div>


          <div className='w-full rounded-md bg-neutral-800/50 py-5 px-4 border-2 border-white/5 justify-between flex flex-col gap-5 sm:px-6 xl:flex-row'>
            <div className='flex flex-col gap-2 xl:w-64 xl:shrink-0'>
                <p className='font-poppins text-xl'>Fullscreen Mode</p>
                <p className='font-poppins text-sm text-neutral-500 max-w-60 tracking-tight'>Toggle the app's full screen state.</p>

            </div>

            <div className='rounded-md border-2 border-white/5 w-full min-w-0 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5'>
                  <div className='flex min-w-0 flex-col gap-2'>
                    <p className='font-poppins flex items-center gap-2'>Fullscreen Shortcut <span className='px-2 py-0.5 rounded-full bg-neutral-700 text-xs text-neutral-300 '>Desktop</span></p>
                    <p className='text-sm text-neutral-500 font-poppins tracking-tight'>Press the <kbd className='px-1.5 py-0.5 rounded bg-neutral-700 border border-neutral-600 font-mono text-xs text-white'>F</kbd> key on your keyboard to enter or exit fullscreen.</p>
                  </div>

                  <div>
                    <button
                      onClick={() => {
                        if (!document.fullscreenElement) {
                          document.documentElement.requestFullscreen().catch((err) => {
                            console.error("Error attempting to enable fullscreen mode:", err);
                          });
                        } else {
                          if (document.exitFullscreen) {
                            document.exitFullscreen();
                          }
                        }
                      }}
                      className='px-4 py-2 bg-white text-black font-poppins font-medium rounded-md hover:bg-neutral-200 transition-colors duration-200 cursor-pointer'
                    >
                      Toggle Fullscreen
                    </button>
                  </div>
            </div>
            
          </div>


          <div className='w-full rounded-md bg-neutral-800/50 py-5 px-4 border-2 border-white/5 justify-between flex flex-col gap-5 sm:px-6 xl:flex-row'>
            <div className='flex flex-col gap-2 xl:w-64 xl:shrink-0'>
                <p className='font-poppins text-xl'>Appearance</p>
                <p className='font-poppins text-sm text-neutral-500 max-w-55 tracking-tight'>Customize the look and feel of the app.</p>

            </div>

            <div className='rounded-md border-2 border-white/5 w-full min-w-0 flex flex-col gap-2 items-center justify-between'>
                  
              <div className='w-full px-4 py-4 flex flex-col gap-5 justify-between sm:px-5 lg:flex-row lg:items-center'>
                <div className='flex min-w-0 flex-col gap-1 justify-center'>
                    <p className='font-poppins'>Text Color</p>
                    <p className='font-poppins text-sm text-neutral-500 '>Adjust the text color for better readability.</p>
                </div>

                <div className='flex flex-wrap gap-4 font-poppins items-center sm:gap-6'>
                    
                  <div onClick={() => handleTextCOlor("white")} className={` rounded-full size-9 cursor-pointer transition-all duration-200 bg-white ${textColor === "white" ? " ring-2 ring-white ring-offset-2 ring-offset-neutral-900" : ""}`} />
                    
                  <div onClick={() => handleTextCOlor("gold")} className={` rounded-full size-9 cursor-pointer transition-all duration-200 bg-[#F4C95D] ${textColor === "gold" ? " ring-2 ring-[#F4C95D] ring-offset-2 ring-offset-neutral-900" : ""}`} />

                  <div onClick={() => handleTextCOlor("coral")} className={` rounded-full size-9 cursor-pointer transition-all duration-200  bg-[#FF7A90] ${textColor === "coral" ? " ring-2 ring-[#FF7A90] ring-offset-2 ring-offset-neutral-900" : ""}`} />

                  <div onClick={() => handleTextCOlor("blue")} className={` rounded-full size-9 cursor-pointer transition-all duration-200  bg-[#7DD3FC] ${textColor === "blue" ? " ring-2 ring-[#7DD3FC] ring-offset-2 ring-offset-neutral-900" : ""}` }/>

                  <div onClick={() => handleTextCOlor("mint")} className={` rounded-full size-9 cursor-pointer transition-all duration-200  bg-[#6EE7B7] ${textColor === "mint" ? " ring-2 ring-[#6EE7B7] ring-offset-2 ring-offset-neutral-900" : ""}` }/>

                  <div onClick={() => handleTextCOlor("purple")} className={` rounded-full size-9 cursor-pointer transition-all duration-200  bg-[#A78BFA] ${textColor === "purple" ? " ring-2 ring-[#A78BFA] ring-offset-2 ring-offset-neutral-900" : ""}` }/>

                  <div onClick={() => handleTextCOlor("peach")} className={` rounded-full size-9 cursor-pointer transition-all duration-200  bg-[#FDBA74] ${textColor === "peach" ? " ring-2 ring-[#FDBA74] ring-offset-2 ring-offset-neutral-900" : ""}`} />

                  <div onClick={() => handleTextCOlor("lime")} className={` rounded-full size-9 cursor-pointer transition-all duration-200  bg-lime-300 ${textColor === "lime" ? " ring-2 ring-lime-300 ring-offset-2 ring-offset-neutral-900" : ""}` }/>
                  
                  {/* Custom color picker */}
                  <div className="relative size-9">
                    <input 
                      type="color" 
                      value={textColor?.startsWith('#') ? textColor : "#ffffff"} 
                      onChange={(e) => handleTextCOlor(e.target.value)} 
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer rounded-full z-10"
                    />
                    <div 
                      className={`rounded-full size-9 border-2 border-dashed border-white/40 flex items-center justify-center cursor-pointer transition-all duration-200`}
                      style={{ 
                        backgroundColor: textColor?.startsWith('#') ? textColor : "transparent",
                        borderColor: textColor?.startsWith('#') ? textColor : "rgba(255,255,255,0.4)",
                        boxShadow: textColor?.startsWith('#') ? `0 0 0 2px #171717, 0 0 0 4px ${textColor}` : undefined
                      }}
                    >
                      {!textColor?.startsWith('#') && (
                        <span className="text-[20px] font-medium leading-none text-white/60">+</span>
                      )}
                    </div>
                  </div>

                </div>

              </div>

                

                    
            </div>
            
          </div>


          <div className='h-10 w-full bg-transparent border border-transparent '></div>

      </div>
      

    </div>
  )
}

export default Settings
