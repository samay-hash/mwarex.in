'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Youtube, Twitter, Github, Linkedin, Sparkles, Rocket, Users, Globe } from 'lucide-react';

export function FounderSection() {
    return (
        <section className="relative py-28 md:py-36 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                {/* Soft radial glow behind photo area */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.04] dark:bg-primary/[0.06] blur-3xl" />
                {/* Subtle grid overlay */}
                <div
                    className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
                    style={{
                        backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
                        backgroundSize: '80px 80px',
                    }}
                />
            </div>

            <div className="max-w-6xl mx-auto px-6">
                {/* Section Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium">
                        <Sparkles className="w-3.5 h-3.5" />
                        Meet the Founder
                    </span>
                </motion.div>

                {/* Main Content – Asymmetric Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    {/* Left: Photo + Social */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="lg:col-span-5 flex flex-col items-center lg:items-start"
                    >
                        {/* Photo Container */}
                        <div className="relative group">
                            {/* Glow ring */}
                            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/20 via-violet-500/10 to-indigo-500/20 blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-700" />

                            {/* Photo */}
                            <div className="relative w-72 h-80 sm:w-80 sm:h-[22rem] rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-black/10 dark:shadow-black/30">
                                <Image
                                    src="/images/samay-samrat.jpg"
                                    alt="Samay Samrat – Founder of MwareX"
                                    fill
                                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                                    priority
                                    sizes="(max-width: 768px) 288px, 320px"
                                />
                                {/* Subtle gradient overlay at bottom */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                                {/* Name overlay on photo */}
                                <div className="absolute bottom-0 inset-x-0 p-5">
                                    <p className="text-white font-bold text-lg tracking-tight">Samay Samrat</p>
                                    <p className="text-white/70 text-sm">Founder & CEO</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="flex items-center gap-3 mt-6"
                        >
                            {[
                                { icon: Youtube, href: 'https://www.youtube.com/@futxsamay', label: 'YouTube', hoverColor: 'hover:text-red-500 hover:border-red-500/30' },
                                { icon: Twitter, href: 'https://x.com/ChemistGamer1', label: 'Twitter', hoverColor: 'hover:text-sky-500 hover:border-sky-500/30' },
                                { icon: Github, href: 'https://github.com/samay-hash', label: 'GitHub', hoverColor: 'hover:text-foreground hover:border-foreground/30' },
                                { icon: Linkedin, href: 'https://www.linkedin.com/in/samay-samrat-b122a5339/', label: 'LinkedIn', hoverColor: 'hover:text-blue-600 hover:border-blue-600/30' },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className={`w-10 h-10 rounded-xl bg-secondary/60 border border-border/50 flex items-center justify-center text-muted-foreground transition-all duration-300 ${social.hoverColor} hover:bg-background hover:shadow-md`}
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                        className="lg:col-span-7 text-center lg:text-left"
                    >
                        {/* Headline */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-[1.15] tracking-tight mb-6">
                            Building the future of{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-500 to-indigo-500">
                                creator collaboration
                            </span>
                        </h2>

                        {/* Story */}
                        <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed mb-10">
                            <p>
                                <strong className="text-foreground">Samay Samrat</strong> is an Indian entrepreneur, YouTuber, and the founder of MwareX — a platform designed to bridge the gap between creators and editors.
                            </p>
                            <p>
                                Frustrated by the broken workflows of managing editors, reviewing drafts, and publishing content,
                                Samay built MwareX to streamline the entire video production pipeline — from raw upload to one-click YouTube publish.
                            </p>
                            <p className="text-foreground/80">
                                &ldquo;Every creator deserves a team that works in sync. MwareX makes that possible — securely, seamlessly, and at scale.&rdquo;
                            </p>
                        </div>

                        {/* Highlight Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-10">
                            {[
                                { icon: Rocket, value: '2026', label: 'Founded', color: 'text-primary' },
                                { icon: Users, value: '500+', label: 'Early Users', color: 'text-violet-500' },
                                { icon: Globe, value: 'India', label: 'Headquartered', color: 'text-indigo-500' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                                    className="group p-4 rounded-xl bg-card/50 dark:bg-card/30 border border-border/40 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 text-center"
                                >
                                    <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-2 opacity-70 group-hover:opacity-100 transition-opacity`} />
                                    <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            <Link
                                href="/founder"
                                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-violet-600 text-white font-semibold text-sm hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02] transition-all duration-300"
                            >
                                Read Full Story
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
