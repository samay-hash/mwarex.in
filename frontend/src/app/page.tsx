"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { FeatureGrid } from "@/components/feature-grid";
import { HowItWorks } from "@/components/how-it-works";
import { PricingSection } from "@/components/pricing-section";
import { ProductPreview } from "@/components/product-preview";
import { Testimonials } from "@/components/testimonials";
import { Layers, ArrowRight, Github, Twitter, Linkedin, Sparkles, Youtube, Play } from "lucide-react";
import { MWareXLogo } from '@/components/mwarex-logo';
import { LandingPageOnboarding } from "@/components/onboarding";

export default function LandingPage() {
  return (
    <div className="min-h-screen text-foreground selection:bg-primary/30 font-sans">
      <SiteHeader />

      <main>
        <HeroSection />

        {/* Trust / Partners Section */}
        <section className="py-12 border-y border-border bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">
              Trusted by the best.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 hover:opacity-100 transition-all duration-500">
              {/* Simple text logos for now since we don't have SVGs, styled to look like logos */}
              <span className="text-xl font-bold font-serif text-foreground">Acme.Corp</span>
              <span className="text-xl font-bold font-mono text-foreground">Vortex</span>
              <span className="text-xl font-black tracking-tighter text-foreground">YOUTUBE API</span>
              <span className="text-xl font-bold italic text-foreground">EditorInc</span>
              <span className="text-xl font-light tracking-[0.2em] text-foreground">STUDIO</span>
            </div>
          </div>
        </section>

        <HowItWorks />

        <FeatureGrid />

        <ProductPreview />

        <PricingSection />

        <Testimonials />

        {/* Enhanced Final CTA Section */}
        <section className="py-36 md:py-44 relative overflow-hidden bg-transparent">
          {/* Premium Multi-layer Background Effects */}
          <div className="absolute inset-0 -z-10">
            {/* Primary Central Glow */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ willChange: "transform, opacity" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]"
            />

            {/* Secondary Violet Accent */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 30, 0],
                opacity: [0.05, 0.15, 0.05],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              style={{ willChange: "transform, opacity" }}
              className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[100px]"
            />

            {/* Tertiary Indigo Accent */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                y: [0, -20, 0],
                opacity: [0.05, 0.1, 0.05],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4,
              }}
              style={{ willChange: "transform, opacity" }}
              className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[110px]"
            />

            {/* Subtle Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `
                  linear-gradient(var(--foreground) 1px, transparent 1px),
                  linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
                `,
                backgroundSize: '80px 80px',
              }}
            />

            {/* Floating Particles - Reduced count and optimized */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 5 + i * 0.8,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                style={{
                  top: `${20 + (i * 10) % 60}%`,
                  left: `${15 + (i * 15) % 80}%`,
                  willChange: "transform, opacity"
                }}
                className="absolute w-1 h-1 bg-primary/30 rounded-full"
              />
            ))}
          </div>

          <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-sm mb-10"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
              <span className="text-primary font-semibold text-sm">Join 10,000+ Creators</span>
            </motion.div>

            {/* Main Heading - Improved sizing and styling */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-foreground leading-[1.1] tracking-tight"
            >
              Ready to scale your
              <br className="hidden sm:block" />
              <span className="relative inline-block mt-2">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500">
                  YouTube Empire
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute bottom-2 left-0 w-full h-4 bg-primary/15 -z-0 origin-left rounded-sm"
                />
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">?</span>
            </motion.h2>

            {/* Subtitle */}
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12"
            >
              The professional operating system for creators and editing teams. Start your free trial today.
            </motion.p>

            {/* CTA Buttons - Improved design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
            >
              <Link href="/auth/signup">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-10 md:px-12 py-5 bg-primary text-primary-foreground rounded-full font-bold text-base md:text-lg transition-all shadow-2xl shadow-primary/30 overflow-hidden"
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 4,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="relative flex items-center gap-2">
                    Get Started Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>

              <Link href="/auth/signin">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-10 md:px-12 py-5 bg-secondary/80 backdrop-blur-sm border border-border text-foreground rounded-full font-bold text-base md:text-lg hover:bg-secondary hover:border-primary/30 transition-all flex items-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>Free forever for individuals</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>Setup in under 2 minutes</span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer - Compact & Professional */}
      <footer className="py-10 border-t border-border bg-background relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4">
                <MWareXLogo showText={true} size="md" href="/" />
              </div>
              <p className="text-muted-foreground text-sm max-w-xs mb-4">
                The secure operating system for modern YouTube creators and editing teams.
              </p>
              <div className="flex gap-3">
                <a href="https://github.com/samay-hash" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent hover:border-primary/30 transition-all">
                  <Github className="w-4 h-4" />
                </a>
                <a href="https://x.com/ChemistGamer1" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent hover:border-primary/30 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://www.youtube.com/@futxsamay" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent hover:border-primary/30 transition-all">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Product</h4>
              <ul className="space-y-2.5 text-muted-foreground text-sm">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#workflow" className="hover:text-foreground transition-colors">How It Works</Link></li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Resources</h4>
              <ul className="space-y-2.5 text-muted-foreground text-sm">
                <li><Link href="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">API Reference</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Support</Link></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Legal</h4>
              <ul className="space-y-2.5 text-muted-foreground text-sm">
                <li><Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © 2026 MWareX Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SocialLink({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent hover:border-primary/30 transition-all">
      {icon}
    </a>
  );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-muted-foreground hover:text-foreground transition-colors">
        {children}
      </Link>
    </li>
  );
}
