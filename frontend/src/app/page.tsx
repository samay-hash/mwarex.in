"use client";

import React from "react";
import { SiteHeader } from "@/components/site-header";
import { BlurReveal } from "@/components/BlurReveal";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Shield, Download, MessageCircle, Youtube, Lock, GitBranch, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WorkflowAnimation } from "@/components/workflow-animation";
import { ScrollDoorSection } from "@/components/scroll-door-section";
import { PricingSection } from "@/components/pricing-section";
import { SmoothButton } from "@/components/smooth-button";

export default function LandingPage() {
  const router = useRouter();
  const { scrollY } = useScroll();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 300]);

  return (
    // Global Grid Background applied to the main wrapper
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-red-500/20 relative">

      {/* GLOBAL BACKGROUND: Net/Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-[0.1] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
                 linear-gradient(to right, #808080 1px, transparent 1px),
                 linear-gradient(to bottom, #808080 1px, transparent 1px)
               `,
          backgroundSize: '50px 50px',
          // Radial fade out to make it feel like a spotlight in center
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 80%)'
        }}
      />

      <SiteHeader />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center px-6 md:px-12 pt-20 z-10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              v2.0 Live
            </motion.div>

            <div className="mb-8">
              <BlurReveal
                text="Zero Downloads."
                className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-[0.9] tracking-tight block mb-2"
                delay={0.1}
              />
              <BlurReveal
                text="Zero Risk."
                className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-[0.9] tracking-tight block italic text-muted-foreground/80 mb-2"
                delay={0.3}
              />
              <BlurReveal
                text="Pure Flow."
                className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-[0.9] tracking-tight block text-primary"
                delay={0.5}
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-2xl md:text-3xl font-medium mb-6 text-muted-foreground"
            >
              Upload • Review • Approve • Publish
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-6 mt-12 w-full sm:w-auto items-center justify-start"
            >
              {/* Primary: Start Free Trial */}
              <SmoothButton
                variant="primary"
                onClick={() => {
                  setTimeout(() => router.push('/auth/signup'), 400);
                }}
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </SmoothButton>

              {/* Secondary: See The Workflow */}
              <SmoothButton
                variant="secondary"
                onClick={() => {
                  const element = document.getElementById('workflow');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                See The Workflow
              </SmoothButton>
            </motion.div>
          </div>

          {/* Removed Right Visual Image as per previous request */}
        </div>
      </section>

      {/* Scroll Door Section (Transition to Workflow) */}
      <ScrollDoorSection>
        <BlurReveal text="Start" className="text-4xl md:text-6xl font-serif font-bold mb-2" />
        <BlurReveal text=" Secure Workflow" className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6" delay={0.2} />
        <p className="text-xl text-muted-foreground max-w-lg mx-auto">
          MWareX lets editors upload videos securely while creators
          review and approve them in one click — without downloads,
          password sharing, or risk to your YouTube channel.

        </p>
        <div className="mt-8">
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-primary to-transparent mx-auto animate-pulse" />
        </div>
      </ScrollDoorSection>


      {/* Connected Workflow Section (The Line Animation) */}
      <section id="workflow" className="relative z-0 min-h-[1200px]">
        <WorkflowAnimation />
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 relative z-10 bg-background/50 backdrop-blur-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-serif font-medium mb-6">Built for Security & Speed</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              The only platform that protects your channel while accelerating your production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="No Channel Access"
              description="Editors upload to our secure server. You keep your credentials safe forever."
              delay={0.1}
            />
            <FeatureCard
              icon={<Download className="w-6 h-6" />}
              title="Zero File Downloads"
              description="Stop wasting hours downloading 10GB renders. Review streams instantly."
              delay={0.2}
            />
            <FeatureCard
              icon={<MessageCircle className="w-6 h-6" />}
              title="WhatsApp Approval"
              description="Get notified on WhatsApp. Approve via a magic link without logging in."
              delay={0.3}
            />
            <FeatureCard
              icon={<Youtube className="w-6 h-6" />}
              title="Server-to-YouTube"
              description="Once APPROVED, we push the file 10x faster than home internet via API."
              delay={0.4}
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6" />}
              title="Secure Workspace"
              description="Isolated environments for every editor. Granular permissions control."
              delay={0.5}
            />
            <FeatureCard
              icon={<GitBranch className="w-6 h-6" />}
              title="Version Control"
              description="Track every change. Compare cuts side-by-side. Never lose progress."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <footer className="py-20 border-t border-border mt-0 relative bg-[#050505] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Top Row: Logo + Links */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-br from-primary to-blue-600 rounded-lg shadow-lg shadow-primary/25">
                <Layers className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-serif font-bold tracking-tight text-white">MWareX.</span>
            </div>

            <div className="flex items-center gap-8">
              <Link href="/terms" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="/privacy-policy" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">
                PrivacyPolicy
              </Link>
              <Link href="#" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">
                Security
              </Link>
              <Link href="samaysamrat64@gmail.com:support@mwarex.com" className="text-sm font-medium text-gray-400 hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Social Media Links Section */}
          <div className="flex flex-col items-center gap-6 py-8 border-t border-white/5">
            <h3 className="text-white font-semibold text-lg">Connect with me</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/samay-hash"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                aria-label="GitHub"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:from-red-500/20 hover:to-red-700/20 transition-all duration-300 border border-white/10 hover:border-red-500/50">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 group-hover:text-gray-300 transition-colors whitespace-nowrap">
                  GitHub
                </span>
              </a>

              <a
                href="https://www.linkedin.com/in/samaysamrat/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                aria-label="LinkedIn"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:from-red-500/20 hover:to-red-700/20 transition-all duration-300 border border-white/10 hover:border-red-500/50">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 group-hover:text-gray-300 transition-colors whitespace-nowrap">
                  LinkedIn
                </span>
              </a>

              <a
                href="https://x.com/ChemistGamer1"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                aria-label="Twitter"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:from-red-500/20 hover:to-red-700/20 transition-all duration-300 border border-white/10 hover:border-red-500/50">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 group-hover:text-gray-300 transition-colors whitespace-nowrap">
                  Twitter
                </span>
              </a>
            </div>
          </div>

          {/* Bottom: Copyright */}
          <div className="text-center pt-8 border-t border-white/5">
            <div className="text-sm text-gray-500">© 2026 MWareX Inc. All locked down.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl glass border border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/30 transition-all duration-300 group shadow-lg"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}
