import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { waitlistAPI } from "@/lib/api";
import { toast } from "sonner";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [count, setCount] = useState<number>(780);

  useEffect(() => {
    fetchCount();
  }, []);

  const fetchCount = async () => {
    try {
      const res = await waitlistAPI.getCount();
      if (res.data?.count) {
        setCount(res.data.count);
      }
    } catch (err) {
      console.error("Failed to fetch waitlist count", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await waitlistAPI.join({ email });
      setIsSuccess(true);
      toast.success(res.data?.message || "Joined the waitlist successfully!");
      if (res.data?.count) {
        setCount(res.data.count);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12 mb-8 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[#C8A97E]/20 to-transparent blur-3xl -z-10 rounded-full" />
      
      {!isSuccess ? (
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="relative"
        >
          <div className="flex items-center bg-[#1A1A1A] border border-white/10 rounded-full p-1 sm:p-1.5 focus-within:border-[#C8A97E]/50 focus-within:ring-1 focus-within:ring-[#C8A97E]/50 transition-all duration-300">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              required
              className="flex-1 min-w-0 bg-transparent border-none outline-none px-3 sm:px-4 text-white placeholder-white/40 text-xs sm:text-sm font-medium"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#C8A97E] flex-shrink-0 text-[#111111] px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1 sm:gap-2 hover:bg-[#D4B88E] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Join Waitlist
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </>
              )}
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1A1A1A] border border-[#C8A97E]/30 rounded-full p-4 flex items-center justify-center gap-3 text-[#C8A97E]"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold text-sm">You're on the list! Keep an eye on your inbox.</span>
        </motion.div>
      )}

      {/* Live Counter */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-white/50"
      >
        <div className="flex -space-x-2">
          <Image src="/waitlist/avatar1.png" alt="Creator 1" width={24} height={24} className="w-6 h-6 rounded-full border border-[#111111] object-cover" />
          <Image src="/waitlist/avatar2.png" alt="Creator 2" width={24} height={24} className="w-6 h-6 rounded-full border border-[#111111] object-cover" />
          <Image src="/waitlist/avatar3.png" alt="Creator 3" width={24} height={24} className="w-6 h-6 rounded-full border border-[#111111] object-cover" />
        </div>
        <span>
          Join <span className="text-[#C8A97E] font-bold">{count.toLocaleString()}</span> creators already waiting.
        </span>
      </motion.div>
    </div>
  );
}
