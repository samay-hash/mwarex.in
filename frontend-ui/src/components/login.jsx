import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router'
import toast from "react-hot-toast"
import { ArrowLeft } from "lucide-react"
import { GoogleLogin } from '@react-oauth/google'

function Login() {
    const navigate = useNavigate()
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post("/api/user/google-login", {
                credential: credentialResponse.credential
            }, { withCredentials: true });
            
            if (res?.data?.success) {
                localStorage.setItem("token", res?.data?.token);
                toast.success(res?.data?.msg || "Successfully logged in!");
                navigate("/clock")
            }
        } catch (err) {
            console.error("Error during Google OAuth backend sign-in: ", err);
            toast.error(
                err?.response?.data?.msg || 
                err?.message || 
                "Google Authentication failed"
            )
        }
    };

    const handleGoogleError = () => {
        toast.error("Google Authentication failed");
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-black text-white font-sans selection:bg-white selection:text-black relative animate-fade-in">
            <title>Login | Timmo — Access Your Focus Dashboard</title>
            <meta name="author" content="Samiran De" />
            <meta name="description" content="Sign in to your Timmo account to track your focus sessions, view your activity heatmaps, check global leaderboards, and resume your workspaces." />
            <div className="grid grid-cols-1 lg:grid-cols-12 h-full w-full">
                
                {/* Showcase Side (Left - Desktop Only) */}
                <div 
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="lg:col-span-6 xl:col-span-7 relative hidden lg:flex flex-col justify-between p-12 bg-black text-white overflow-hidden select-none border-r border-neutral-900/50 cursor-default"
                >
                    
                    {/* Spotlight glow tracking mouse pointer */}
                    <div 
                        className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
                        style={{
                            opacity: isHovered ? 1 : 0,
                            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 85%)`
                        }}
                    />

                    {/* Background Dither Image */}
                    <img 
                        src="/dither.jpg" 
                        alt="Dither Illustration"
                        className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity filter contrast-150 brightness-90 pointer-events-none" 
                    />

                    {/* Overlay Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950 via-neutral-950/40 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-l from-neutral-950/60 to-transparent z-10" />
                    
                    {/* Graphic Grid lines overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none z-10" />

                    {/* Quotes Accent */}
                    <div className="relative z-30 my-auto max-w-lg mx-auto text-center px-4">
                        <p className="font-instrumental text-[clamp(1.75rem,3.5vw,3.25rem)] font-light italic leading-tight text-neutral-200">
                            "Focus is the art of choosing what to ignore."
                        </p>
                        <div className="w-12 h-[1px] bg-neutral-800 mx-auto my-6" />
                        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 font-sans">
                            Timmo Workspace
                        </p>
                    </div>

                    {/* Empty Bottom Space for layout spacing */}
                    <div className="relative z-30" />

                </div>

                {/* Form Side (Right) - Recreated exactly matching the design mockup */}
                <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-8 sm:p-12 md:p-16 bg-[#0a0a0a] text-white relative">
                    
                    {/* Top Navigation */}
                    <div className="flex items-center justify-between w-full z-10">
                        <button 
                            id="login-back-btn"
                            onClick={() => navigate('/')}
                            className="group flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition cursor-pointer"
                        >
                            <span className="text-base">←</span>
                            Back
                        </button>
                    </div>

                    {/* Google Login Center Pane */}
                    <div className="my-auto py-8 max-w-sm w-full mx-auto z-10 flex flex-col items-center text-center space-y-6 animate-fade-in-up">
                        
                        {/* Title - Large spaced typography */}
                        <div className="space-y-2.5">
                            <h2 className="font-sans text-3xl sm:text-4xl tracking-[0.35em] text-white font-black uppercase">
                                timmo
                            </h2>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-550 text-neutral-500">
                                workspace
                            </p>
                        </div>

                        {/* Thin Short Divider */}
                        <div className="w-16 h-[1px] bg-neutral-800/80 mx-auto my-1" />

                        {/* Tagline */}
                        <div className="space-y-1 py-1">
                            <p className="text-sm sm:text-base text-neutral-300 font-sans font-medium">
                                Quiet and productive focus.
                            </p>
                            <p className="text-sm sm:text-base text-[#F4C95D] font-sans font-bold">
                                All in one.
                            </p>
                        </div>

                        {/* Google Login Button Container */}
                        <div className="w-full flex justify-center pt-2 group relative">
                            <div className="relative z-10 w-full flex justify-center">
                                {!import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                                    <div className="text-red-400 text-xs bg-red-950/20 p-4 rounded-xl border border-red-900/30 text-center font-medium w-full leading-relaxed font-sans">
                                        VITE_GOOGLE_CLIENT_ID is not loaded. Please restart your Vite server.
                                    </div>
                                     ) : (
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={handleGoogleError}
                                        theme="outline"
                                        shape="pill"
                                        size="large"
                                        width="320"
                                    />
                                )}
                            </div>
                        </div>



                        {/* Padlock Security Notice */}
                        <div className="flex items-center gap-2 justify-center text-neutral-500">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <span className="text-[10px] font-sans tracking-wide text-neutral-500">Secure passwordless authentication.</span>
                        </div>
                    </div>

                    {/* Footer spacer */}
                    <div className="h-6" />
                </div>

            </div>
        </div>
    )
}

export default Login
