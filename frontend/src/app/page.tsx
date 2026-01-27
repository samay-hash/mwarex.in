"use client";

import React from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { FeatureGrid } from "@/components/feature-grid";
import { HowItWorks } from "@/components/how-it-works";
import { PricingSection } from "@/components/pricing-section";
import { ProductPreview } from "@/components/product-preview";
import { Testimonials } from "@/components/testimonials";
import { Layers, ArrowRight, Github, Twitter, Linkedin } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
      <SiteHeader />

      <main>
        <HeroSection />

        {/* Trust / Partners Section */}
        <section className="py-12 border-y border-border bg-secondary/30">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">
              Empowering creators worldwide
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

        {/* Final CTA Section */}
        <section className="py-32 relative overflow-hidden bg-background">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
          </div>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-foreground">
              Ready to scale your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">YouTube Empire?</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <button className="px-10 py-5 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-primary/30">
                  Get Started Now
                </button>
              </Link>
              <Link href="/auth/signin">
                <button className="px-10 py-5 bg-secondary border border-border text-foreground rounded-full font-bold text-lg hover:bg-accent hover:border-primary/30 transition-all flex items-center gap-2">
                  Sign in with Google <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Compact & Professional */}
      <footer className="py-10 border-t border-border bg-background relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 flex items-center justify-center bg-primary rounded-lg">
                  <Layers className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">MWareX.</span>
              </div>
              <p className="text-muted-foreground text-sm max-w-xs mb-4">
                The secure operating system for modern YouTube creators and editing teams.
              </p>
              <div className="flex gap-3">
                <SocialLink icon={<Github className="w-4 h-4" />} href="https://github.com/samay-hash" />
                <SocialLink icon={<Linkedin className="w-4 h-4" />} href="https://linkedin.com" />
                <SocialLink icon={<Twitter className="w-4 h-4" />} href="https://twitter.com" />
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Product</h4>
              <ul className="space-y-2.5 text-muted-foreground text-sm">
                <FooterLink href="#features">Features</FooterLink>
                <FooterLink href="#pricing">Pricing</FooterLink>
                <FooterLink href="#workflow">How It Works</FooterLink>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Resources</h4>
              <ul className="space-y-2.5 text-muted-foreground text-sm">
                <FooterLink href="#">Documentation</FooterLink>
                <FooterLink href="#">API Reference</FooterLink>
                <FooterLink href="#">Support</FooterLink>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Legal</h4>
              <ul className="space-y-2.5 text-muted-foreground text-sm">
                <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms of Service</FooterLink>
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
