import { useEffect, useState } from 'react'
import './App.css'
import Clock from './components/clock'
import Sidebar from './components/sidebar'
import Body from './components/body'
import { Toaster } from 'react-hot-toast'
import { Analytics } from "@vercel/analytics/react"


function App() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only enable on desktop screens (width >= 1024px)
      const isDesktop = window.innerWidth >= 1024;
      if (!isDesktop) return;

      // Ignore if user is typing in an input field, textarea, or contenteditable element
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable)
      ) {
        return;
      }

      // Check if 'F' or 'f' is pressed without any modifier keys (like Ctrl, Alt, or Cmd)
      if ((e.key === "f" || e.key === "F") && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch((err) => {
            console.error("Error attempting to enable fullscreen mode:", err);
          });
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
 

  return (
    <>
    <div className='flex  selection:text-black selection:bg-white overflow-hidden'>
      <Analytics />
      <Body />
    </div>
    <Toaster position="top-center" />
    </>
  )
}

export default App
