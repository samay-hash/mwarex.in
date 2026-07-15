import React, { useEffect, useState } from 'react'
import { FaCrown, FaFire } from "react-icons/fa6";
import Sidecard from './sidecard';
import axios from 'axios';
import { Zap, Target, Leaf, Crown, Trophy, ShieldAlert, HeartCrack, LifeBuoy, Ghost } from "lucide-react";



const LeaderboardRowSkeleton = ({ index }) => (
    <div className='bg-white/2 border-b-2 border-white/10 px-4 md:px-10 py-1 w-full min-h-16 items-center grid grid-cols-[80px_1fr_195px_135px_120px]'>
        <div className='size-8 rounded-full bg-neutral-800 animate-pulse' />

        <div className='flex items-center gap-2 min-w-0'>
            <div className='size-8 rounded-full bg-neutral-800 animate-pulse' />
            <div className='flex flex-col gap-2'>
                <div className={`h-3 rounded-sm bg-neutral-800 animate-pulse ${index % 3 === 0 ? "w-32" : index % 3 === 1 ? "w-44" : "w-28"}`} />
                <div className='h-2 w-20 rounded-sm bg-neutral-800/70 animate-pulse' />
            </div>
        </div>

        <div className='h-3 w-24 rounded-sm bg-neutral-800 animate-pulse' />

        <div className='flex justify-center'>
            <div className='h-3 w-14 rounded-sm bg-neutral-800 animate-pulse' />
        </div>

        <div className='flex justify-center'>
            <div className='h-5 w-14 rounded bg-neutral-800/50 animate-pulse' />
        </div>
    </div>
)


function Leaderboard() {


    const heroTexts = [
        "is grinding like hell… and you're still waiting for her reply.",

        "already locked in for today. Your bed is winning the battle.",


        "is building their future. You're building a 37-tab browser collection.",

        "is cooking something big. You're cooking excuses.",

        "focused for hours today. Meanwhile, your screen time report is nervous.",

        "chose discipline. You chose 'just one more reel'.",

        "is farming focus points while you're farming dopamine.",

        "woke up and decided to dominate. You woke up and checked Instagram.",

        "is carrying the leaderboard on their back. You are carrying backlogs",

        "is proof that procrastination is optional.",

        "is in beast mode. You're in battery saver mode.",


        "focused more today than most people focus all week.",

        "is chasing dreams. You're chasing the perfect playlist.",

        "is locked in. Your attention span left the chat.",

        "is making history. You're making excuses."
    ];

    const getHeroText = () => {
        return heroTexts[
            Math.floor(Math.random() * heroTexts.length)
        ];
    };






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


    const getAvatarColor = (name) => {
        if (!name) return "hsla(0, 0%, 50%, 0.25)";
        let hash = 0;

        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        const hue = hash % 360;

        return `hsla(${hue}, 70%, 60%, 0.25)`; // low opacity
    };



    const getRankStyle = (rank) => {
        if (rank === 1) {
            return {
                className:
                    "border-2 border-yellow-500 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent font-bold shadow-[0_0_10px_0px] shadow-yellow-400 ",
                style: {
                    animation: "glow 3s ease-in-out infinite"
                }
            };

        }

        if (rank === 2) {
            return {
                className:
                    "border-2 bg-zinc-400/10 border-zinc-300/40 shadow-[0_0_10px_0px_rgba(212,212,216,0.08)]",
                style: {
                    animation: "silverGlow 3s ease-in-out infinite"
                }
            };
        }

        if (rank === 3) {
            return {
                className:
                    "border-2  bg-orange-500/10 border-orange-400/40 shadow-[0_0_10px_0px_rgba(251,146,60,0.08)] ",
                style: {
                    animation: "bronzeGlow 3s ease-in-out infinite"
                }
            };
        }

        return "bg-white/5 border-white/20 text-white";
    };





    const [leaderboard, setLeaderboard] = useState([]);
    const [me, setMe] = useState(null);
    const [heroText, setHeroText] = useState("")
    const [loading, setLoading] = useState(true)
    const [fetchError, setFetchError] = useState("")


    useEffect(() => {
        const fetchLeaderboard = async () => {

            try {

                setLoading(true)


                const [meData, leaderboardData] = await Promise.all([
                    axios.get("/api/leaderboard/me"),
                    axios.get("/api/leaderboard"),
                ]);

                setMe(meData.data);
                setLeaderboard(leaderboardData.data.leaderboard);
                setFetchError("");


                setHeroText(getHeroText());
            } catch (err) {
                console.log("error while leaderboard and me data fetching frontend: ", err);

                if (err?.response?.status === 429) {
                    setFetchError("Too many refreshes. Leaderboard will be available again in about a minute.");
                } else {
                    setFetchError("Leaderboard could not be loaded right now.");
                }
            } finally {
                setLoading(false)
            }
        };

        fetchLeaderboard();

        const interval = setInterval(() => {
            fetchLeaderboard();
        }, 5 * 60 * 1000); // update in every 5 minutes

        return () => clearInterval(interval);
    }, []);





    return (
        <div className='h-screen w-screen bg-neutral-900 justify-center flex px-4 py-6 font-poppins overflow-y-auto sm:px-6 lg:px-10'
            style={{
                scrollbarWidth: "thin",
                scrollbarColor: "gray transparent",
            }} >

            <div className='mx-auto flex w-full max-w-7xl min-w-0 h-full gap-4'>

                <div className='w-full min-w-0 h-full flex gap-3 flex-col ' >

                    <div className='flex w-full min-w-0 flex-col gap-2 border-b border-white/10 pb-5'>
                        <div className='flex flex-col justify-between gap-3 sm:flex-row sm:items-end '>
                            <h1 className='font-poppins text-2xl font-semibold tracking-normal text-white sm:text-4xl'>
                                Leaderboard
                            </h1>
                        </div>


                    </div>


                    <div className='w-full flex flex-col justify-between gap-3 sm:flex-row sm:items-center'>
                        <div className='border-2 border-white/10 rounded-lg h-10 w-full cursor-pointer active:scale-99 transition-all duration-200 bg-neutral-900 flex justify-center items-center sm:w-27'>
                            <p className='font-poppins tracking-tight mx-0.5 sm:mx-0 px-3 py-1 rounded-sm w-full text-center bg-white/10 sm:w-25'>Today</p>
                        </div>

                        <div className='text-sm text-neutral-500 border-2 font-poppins bg-white/2 border-white/10 rounded-sm px-3 tracking-tight font-semibold py-1 flex gap-2 items-center justify-center text-center sm:text-left'>
                            <div className={`${fetchError ? "bg-yellow-500" : "bg-green-500"} shrink-0 text-xl rounded-full size-2`}></div>
                            <p className='min-w-0'>{fetchError || "Updates every 5 minutes"}</p>
                        </div>

                    </div>


                    <div className='rounded-md w-full min-h-50 border-2 border-white/5 pl-5 mt-2 font-poppins flex overflow-hidden sm:pl-7'>
                        <div className='h-full bg-yellow-300 w-0.5  -ml-7 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_60%,transparent)] '></div>
                        <div className='flex min-w-0 flex-1 flex-col gap-3 h-full justify-center py-5 pl-5 sm:pl-7'>
                            <div className='text-xl font-semibold tracking-tight w-full max-w-100 sm:w-100 rounded-sm sm:text-2xl'>
                                {
                                    loading ? (
                                        <div className='h-20 w-full max-w-100  rounded-sm bg-neutral-800 animate-pulse'>

                                        </div>
                                    ) : (
                                        <>
                                            <span className='mr-2  text-amber-300 '>
                                                {leaderboard[0]?.name}
                                            </span>
                                            {heroText}
                                        </>
                                    )
                                }

                            </div>


                            {
                                loading ? (
                                    <div className='w-35 h-5 rounded-sm bg-neutral-800 animate-pulse'>

                                    </div>
                                ) : (
                                    <>
                                        <p className='text-neutral-500 text-xs tracking-tight'>
                                            Showing top 100 users.
                                        </p>
                                    </>
                                )
                            }

                            {
                                loading ? (
                                    <div className='w-50 h-5 rounded-sm bg-neutral-800 animate-pulse'>

                                    </div>
                                ) : (
                                    <>
                                        <div className='flex flex-col gap-1 -mt-2.5 sm:flex-row sm:gap-2'>
                                            <p className='text-neutral-500 text-xs tracking-tight'>Total users : {me?.usersNumber}</p>
                                            <p className='text-neutral-500 text-xs tracking-tight '>  Your rank : # {me?.rank}</p>
                                        </div>
                                    </>
                                )
                            }



                        </div>

                        <div className='hidden overflow-hidden sm:w-[calc(100%-45%)]  rounded-sm h-full md:block '>
                            <img src="hero.webp" alt="hero ui" className='rounded-sm xl:-mt-14 '
                                style={{
                                    WebkitMaskImage:
                                        "linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0))",
                                    maskImage:
                                        "linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0))",
                                }}
                            />
                        </div>

                    </div>


                    <div className='w-full h-full bg-neutral-900 min-w-0'>


                        <div className='rounded-md border-2 border-white/10 w-full h-auto mt-2 overflow-hidden md:overflow-visible'>

                            <div className='hidden border-b-2 border-white/10 font-poppins text-sm text-neutral-500 bg-white/6 rounded-t-sm px-4 md:px-10 py-2 items-center h-10 w-full md:grid md:grid-cols-[80px_1fr_140px_135px_120px]'>
                                <p>Rank</p>
                                <p>Name</p>
                                <p>Today's time</p>
                                <p className='text-center'>Streak</p>
                                <p className='text-center'>Badges</p>
                            </div>


                            <div className='w-full h-auto flex flex-col pb-1 overflow-x-auto md:overflow-visible'
                            >


                                {
                                    loading ? (
                                        <div className='min-w-[720px] md:min-w-0'>
                                            {Array.from({ length: 8 }).map((_, i) => (
                                                <LeaderboardRowSkeleton key={i} index={i} />
                                            ))}
                                        </div>
                                    ) : !loading && leaderboard.length === 0 ? (
                                        <div className='px-10 w-full h-32 font-poppins text-neutral-500 text-sm flex items-center justify-center text-center'>
                                            <p>{fetchError || "No focus time has been logged today yet."}</p>
                                        </div>
                                    ) : (
                                        <div className='min-w-[720px] md:min-w-0'>
                                            {leaderboard.map((user, i) => {

                                                const rankStyle = getRankStyle(i + 1);
                                                const isMe = user.userId === me?.userId;

                                                return (
                                                    <div key={user._id || i} className={`bg-white/2 border-b-2 border-white/10 px-4 md:px-10 py-1 w-full min-h-16 items-center grid grid-cols-[80px_1fr_125px_135px_120px] relative transition-all duration-150 hover:bg-neutral-800/20 hover:z-30 
                                            
                                                ${isMe
                                                            ? `
                                                    bg-white/5
                                                    `
                                                            : ""
                                                        }
                                                
                                            `}>


                                                        {/* Rank */}
                                                        <div className={`rounded-full text-xs size-8  flex items-center  justify-center font-bold ${rankStyle.className}
                                            
                                            
                                             ${getRankStyle(i + 1)}
                                            `}
                                                            style={rankStyle.style}>
                                                            <span className=''>{i + 1}</span>
                                                        </div>

                                                        {/* User */}
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            {user?.picture ? (
                                                                <img
                                                                    src={user.picture}
                                                                    alt={user.name}
                                                                    className="rounded-full size-8 object-cover border border-white/10"
                                                                    referrerPolicy="no-referrer"
                                                                />
                                                            ) : (
                                                                <div className="rounded-full size-8  flex items-center justify-center text-xl"
                                                                    style={{
                                                                        backgroundColor: getAvatarColor(user?.name)
                                                                    }}
                                                                >
                                                                    <p>{user?.name ? user.name[0].toUpperCase() : "?"}</p>
                                                                </div>
                                                            )}

                                                            <div className="flex flex-col min-w-0">
                                                                <div className="flex items-center gap-2 min-w-0">

                                                                    <p className="truncate">
                                                                        {user?.name}
                                                                    </p>

                                                                    {isMe && (
                                                                        <span className="
                                                                text-[10px]
                                                                px-2 py-0.5
                                                                rounded-full
                                                                bg-yellow-500/15
                                                                text-yellow-300
                                                                border border-yellow-500/20
                                                                font-semibold
                                                            ">
                                                                            YOU
                                                                        </span>
                                                                    )}

                                                                </div>
                                                            </div>


                                                        </div>

                                                        {/* Time */}
                                                        <div className=''>
                                                            <p>{formatTime(user?.todayTime)}</p>
                                                        </div>

                                                        {/* Streak */}
                                                        <div className="flex items-center gap-1  justify-center ">
                                                            <FaFire className="text-amber-600" />
                                                            <span>{user?.streak}</span>
                                                        </div>
                                                         {/* Badges Column */}
                                                         <div className="flex justify-center items-center">
                                                              {(() => {
                                                                  const userBadges = user.badges || [];
                                                                  if (userBadges.length === 0) return <span className="text-neutral-600 text-xs font-semibold font-poppins">-</span>;
                                                                  return (
                                                                      <div className="relative group/tooltip flex items-center select-none font-poppins">
                                                                          {/* Badge Icons & Overflow Count */}
                                                                          <div className="flex gap-1.5 items-center cursor-pointer">
                                                                              {userBadges.slice(0, 2).map((b) => {
                                                                                  let Icon = null;
                                                                                  let bgStyle = "";
                                                                                  let glowStyle = "";
                                                                                  if (b === "newbie") { 
                                                                                      Icon = Zap; 
                                                                                      bgStyle = "bg-lime-400 border-lime-400 text-black"; 
                                                                                      glowStyle = "shadow-emerald-500/10 hover:shadow-emerald-500/30";
                                                                                  } else if (b === "locked_in") { 
                                                                                      Icon = Target; 
                                                                                      bgStyle = "bg-orange-400 border-orange-400 text-black"; 
                                                                                      glowStyle = "shadow-orange-500/10 hover:shadow-orange-500/30";
                                                                                  } else if (b === "unstoppable") { 
                                                                                      Icon = Leaf; 
                                                                                      bgStyle = "bg-emerald-400 border-emerald-400 text-black"; 
                                                                                      glowStyle = "shadow-blue-500/10 hover:shadow-blue-500/30";
                                                                                  } else if (b === "elite") { 
                                                                                      Icon = Crown; 
                                                                                      bgStyle = "bg-purple-400 border-purple-400 text-black"; 
                                                                                      glowStyle = "shadow-purple-500/10 hover:shadow-purple-500/30";
                                                                                  } else if (b === "day_conqueror") { 
                                                                                      Icon = Trophy; 
                                                                                      bgStyle = "bg-yellow-400 border-yellow-400 text-black"; 
                                                                                      glowStyle = "shadow-yellow-500/10 hover:shadow-yellow-500/30";
                                                                                  } else if (b === "okay_at_home") { 
                                                                                      Icon = ShieldAlert; 
                                                                                      bgStyle = "bg-red-400 border-red-400 text-black"; 
                                                                                      glowStyle = "shadow-red-500/10 hover:shadow-red-500/30";
                                                                                  } else if (b === "who_hurt_you") { 
                                                                                      Icon = HeartCrack; 
                                                                                      bgStyle = "bg-rose-400 border-rose-400 text-black"; 
                                                                                      glowStyle = "shadow-rose-500/10 hover:shadow-rose-500/30";
                                                                                  } else if (b === "seek_help") { 
                                                                                      Icon = LifeBuoy; 
                                                                                      bgStyle = "bg-teal-400 border-teal-400 text-black"; 
                                                                                      glowStyle = "shadow-teal-500/10 hover:shadow-teal-500/30";
                                                                                  } else if (b === "sunlight_allergic") { 
                                                                                      Icon = Ghost; 
                                                                                      bgStyle = "bg-amber-400 border-amber-400 text-black"; 
                                                                                      glowStyle = "shadow-amber-500/10 hover:shadow-amber-500/30";
                                                                                  }

                                                                                  if (!Icon) return null;
                                                                                  return (
                                                                                      <div 
                                                                                          key={b} 
                                                                                          className={`w-6.5 h-6.5 rounded-md border flex items-center justify-center shadow-md hover:scale-115 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ${bgStyle} ${glowStyle}`}
                                                                                      >
                                                                                          <Icon className="size-3.5" />
                                                                                      </div>
                                                                                  );
                                                                              })}
                                                                              {userBadges.length > 2 && (
                                                                                  <div className="text-[10px] text-neutral-300 font-bold bg-neutral-850 hover:bg-neutral-800 px-1.5 py-0.5 rounded border border-white/10 shadow-sm transition-colors duration-150">
                                                                                      {userBadges.length - 2}+
                                                                                  </div>
                                                                              )}
                                                                          </div>
                                                                          {/* Custom Tooltip ("Tulip") - Positioned above the badge icons */}
                                                                          <div className="absolute bottom-[135%] left-1/2 -translate-x-1/2 hidden group-hover/tooltip:flex flex-col gap-2.5 bg-neutral-950/98 backdrop-blur-md border border-white/10 p-3.5 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] z-50 pointer-events-none w-80 animate-in fade-in slide-in-from-bottom-2 duration-150 font-poppins">
                                                                              <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest border-b border-white/5 pb-2 text-center font-poppins">
                                                                                  Earned Badges
                                                                              </div>
                                                                              <div className="grid grid-cols-3 gap-2 font-poppins">
                                                                                  {userBadges.map((badgeId) => {
                                                                                      let name = "";
                                                                                      let Icon = null;
                                                                                      let style = "";
                                                                                      if (badgeId === "newbie") { name = "Touched the Timer"; Icon = Zap; style = "bg-lime-400 border-lime-400 text-black"; }
                                                                                      else if (badgeId === "locked_in") { name = "Locked In"; Icon = Target; style = "bg-orange-400 border-orange-400 text-black"; }
                                                                                      else if (badgeId === "unstoppable") { name = "Touch Grass Pls"; Icon = Leaf; style = "bg-emerald-400 border-emerald-400 text-black"; }
                                                                                      else if (badgeId === "elite") { name = "Has No Life"; Icon = Crown; style = "bg-purple-400 border-purple-400 text-black"; }
                                                                                      else if (badgeId === "day_conqueror") { name = "No Grass Toucher"; Icon = Trophy; style = "bg-yellow-400 border-yellow-400 text-black"; }
                                                                                      else if (badgeId === "okay_at_home") { name = "Everything Okay At Home?"; Icon = ShieldAlert; style = "bg-red-400 border-red-400 text-black"; }
                                                                                      else if (badgeId === "who_hurt_you") { name = "Who Hurt You?"; Icon = HeartCrack; style = "bg-rose-400 border-rose-400 text-black"; }
                                                                                      else if (badgeId === "seek_help") { name = "Seek Professional Help"; Icon = LifeBuoy; style = "bg-teal-400 border-teal-400 text-black"; }
                                                                                      else if (badgeId === "sunlight_allergic") { name = "Allergic to Sunlight"; Icon = Ghost; style = "bg-amber-400 border-amber-400 text-black"; }
                                                                                      
                                                                                      if (!Icon) return null;
                                                                                      return (
                                                                                          <div key={badgeId} className={`flex flex-col items-center justify-center text-center p-2 rounded-lg border text-[9px] font-bold font-poppins gap-1.5 transition-all duration-150 ${style}`}>
                                                                                              <Icon className="size-5 shrink-0" />
                                                                                              <span className="leading-tight select-none text-[8px] font-medium tracking-tight break-words max-w-[76px]">{name}</span>
                                                                                          </div>
                                                                                      );
                                                                                  })}
                                                                              </div>
                                                                              {/* Arrow pointing down */}
                                                                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-neutral-950/98" />
                                                                          </div>
                                                                      </div>
                                                                  );
                                                              })()}
                                                         </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                }





                                <div className='px-10 w-full h-20 font-poppins text-neutral-500 text-sm flex items-center justify-center gap-1 flex-col '>
                                    <p>Showing top 100 users.</p>

                                    <p className='text-neutral-600'>Procrastinators were filtered out.</p>
                                </div>

                            </div>


                        </div>

                    </div>



                </div>

                <div className='hidden justify-center items-start lg:flex'>
                    <Sidecard me={me} loading={loading} />
                </div>
            </div>

        </div>
    )
}

export default Leaderboard
