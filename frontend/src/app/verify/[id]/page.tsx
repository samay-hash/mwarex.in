"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ShieldCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Certificate {
  certificateId: string;
  name: string;
  role: string;
  company: string;
  issueDate: string;
  duration: string;
  status: string;
  issuedBy: {
    name: string;
    title: string;
  };
}

export default function VerificationPage() {
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchCertificate = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        const res = await fetch(`${backendUrl}/api/v1/certificates/${id}`);
        const data = await res.json();

        if (data.success && data.data) {
          setCertificate(data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching certificate", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificate();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C8A97E] animate-spin" />
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#111111] border border-red-500/20 rounded-2xl p-10 text-center shadow-[0_0_50px_rgba(239,68,68,0.1)]"
        >
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-serif text-white mb-2">Invalid Certificate</h1>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            This certificate does not exist or has been revoked. Please check the Certificate ID and try again.
          </p>
          <div className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5 text-xs text-white/40 font-mono">
            ID: {id}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden py-20 px-4 sm:px-6">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C8A97E]/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/[0.02] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-b from-[#1a1a1a] to-transparent p-8 md:p-12 text-center border-b border-white/5 relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C8A97E]/30 to-transparent" />
            
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative"
            >
              <div className="absolute inset-0 border border-emerald-500/20 rounded-full animate-ping opacity-20" />
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Certificate Successfully Verified
            </h1>
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">
                Status: {certificate.status}
              </span>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
              
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Certificate ID</p>
                <p className="text-white font-mono text-lg">{certificate.certificateId}</p>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Issued To</p>
                <p className="text-white text-xl font-medium">{certificate.name}</p>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Role</p>
                <p className="text-[#C8A97E] text-lg font-medium">{certificate.role}</p>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Company</p>
                <p className="text-white/80 text-lg">{certificate.company}</p>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Duration</p>
                <p className="text-white/80 text-lg">{certificate.duration}</p>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Issued On</p>
                <p className="text-white/80 text-lg">
                  {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>

            </div>
          </div>

          {/* Footer Signature */}
          <div className="bg-[#0a0a0a]/50 p-8 md:px-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-10 h-10 text-[#C8A97E]/60" strokeWidth={1} />
              <div>
                <p className="text-white/40 text-xs tracking-wider uppercase mb-1">Digitally Verified By</p>
                <p className="text-white font-serif text-lg tracking-wide">Mwarex Security System</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-white/90 font-medium mb-1">{certificate.issuedBy?.name}</p>
              <p className="text-[#C8A97E] text-xs uppercase tracking-wider">{certificate.issuedBy?.title}</p>
            </div>
          </div>

        </motion.div>
        
        <div className="mt-8 text-center">
          <p className="text-white/30 text-xs flex items-center justify-center gap-2">
             <ShieldCheck className="w-3 h-3" /> Secure Verification Portal • https://verify.mwarex.in
          </p>
        </div>
      </div>
    </div>
  );
}
