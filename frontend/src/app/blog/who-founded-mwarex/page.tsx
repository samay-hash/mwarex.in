import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Who Founded Mwarex? Story Behind the Platform | Mwarex Blog",
    description: "Discover the story of how Samay Samrat founded Mwarex, India's first scalable middleware platform for content creators and editors.",
    openGraph: {
        title: "Who Founded Mwarex? Story Behind the Platform",
        description: "Learn about Samay Samrat, the founder of Mwarex, and the vision behind India's premier creator workflow platform.",
        url: "https://mwarex.in/blog/who-founded-mwarex",
        siteName: "Mwarex",
        type: "article",
        publishedTime: "2026-02-03T00:00:00.000Z",
        authors: ["Samay Samrat"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Who Founded Mwarex? Story Behind the Platform",
        description: "Learn about Samay Samrat, the founder of Mwarex.",
    },
    alternates: {
        canonical: "https://mwarex.in/blog/who-founded-mwarex",
    },
};

export default function WhoFoundedMwarexPage() {
    // Schema.org structured data for Article
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Who Founded Mwarex? Story Behind the Platform",
        author: {
            "@type": "Person",
            name: "Samay Samrat",
            url: "https://mwarex.in/founder",
        },
        publisher: {
            "@type": "Organization",
            name: "Mwarex",
            url: "https://mwarex.in",
        },
        datePublished: "2026-02-03",
        dateModified: "2026-02-03",
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://mwarex.in/blog/who-founded-mwarex",
        },
        about: {
            "@type": "Person",
            name: "Samay Samrat",
            jobTitle: "Founder",
            worksFor: {
                "@type": "Organization",
                name: "Mwarex",
            },
        },
    };

    return (
        <>
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />

            <main className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Back Link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m12 19-7-7 7-7" />
                            <path d="M19 12H5" />
                        </svg>
                        Back to Home
                    </Link>

                    {/* Article */}
                    <article className="prose prose-lg dark:prose-invert max-w-none">
                        {/* Article Header */}
                        <header className="not-prose space-y-6 mb-12">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                                    Company Story
                                </span>
                                <time dateTime="2026-02-03">February 3, 2026</time>
                            </div>

                            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70">
                                Who Founded Mwarex? Story Behind the Platform
                            </h1>

                            <p className="text-xl text-muted-foreground leading-relaxed">
                                The inspiring journey of how Samay Samrat created India&apos;s first
                                scalable middleware platform for content creators and editors.
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-lg font-bold text-primary-foreground">
                                    SS
                                </div>
                                <div>
                                    <Link href="/founder" className="font-semibold hover:text-primary transition-colors">
                                        Samay Samrat
                                    </Link>
                                    <p className="text-sm text-muted-foreground">Founder of Mwarex</p>
                                </div>
                            </div>
                        </header>

                        {/* Article Content */}
                        <div className="space-y-6">
                            <h2>The Vision Behind Mwarex</h2>

                            <p>
                                Every great platform starts with a simple observation. For <strong>Samay Samrat</strong>,
                                that observation came from watching content creators struggle with the chaos of
                                video production workflows. The question was simple: why should managing a
                                YouTube channel feel like herding cats?
                            </p>

                            <p>
                                <strong>Samay Samrat founded Mwarex</strong> with a singular mission — to streamline
                                the collaboration between creators and their editing teams. What started as a
                                personal frustration with existing tools evolved into India&apos;s first comprehensive
                                middleware platform for the creator economy.
                            </p>

                            <h2>Why Mwarex Was Created</h2>

                            <p>
                                The content creation landscape has exploded in recent years. YouTubers are no
                                longer solo operators — they&apos;re managing teams of editors, thumbnails designers,
                                and content managers. But the tools available to them were built for a different era.
                            </p>

                            <blockquote className="border-l-4 border-primary pl-6 italic my-8">
                                &ldquo;I saw creators spending more time managing their workflow than actually creating.
                                That&apos;s when I knew something had to change.&rdquo;
                                <footer className="text-sm text-muted-foreground mt-2 not-italic">
                                    — Samay Samrat, <cite>Founder of Mwarex</cite>
                                </footer>
                            </blockquote>

                            <p>
                                The <strong>Mwarex founder</strong> identified three critical problems plaguing creators:
                            </p>

                            <ul>
                                <li><strong>Fragmented Communication:</strong> Feedback scattered across WhatsApp, email, and Google Drive</li>
                                <li><strong>No Version Control:</strong> Multiple versions of videos floating around without clear tracking</li>
                                <li><strong>Publishing Friction:</strong> Creators still had to manually download and upload approved videos</li>
                            </ul>

                            <h2>The Mwarex Solution</h2>

                            <p>
                                Mwarex brings everything under one roof. Upload, review, approve, and publish —
                                all from a single, intuitive interface. The platform was designed by <strong>Samay Samrat</strong>
                                to feel invisible, getting out of the way so creators can focus on what matters:
                                making great content.
                            </p>

                            <div className="not-prose p-6 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 my-8">
                                <h3 className="text-xl font-semibold mb-4">Key Features Built by the Founder</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Direct upload and review with timestamped comments</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>One-click approval workflow for faster turnaround</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Seamless YouTube integration for direct publishing</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Team management with role-based permissions</span>
                                    </li>
                                </ul>
                            </div>

                            <h2>Looking Forward</h2>

                            <p>
                                The journey is just beginning. <strong>Samay Samrat</strong>, as the <strong>founder of Mwarex</strong>,
                                continues to evolve the platform based on creator feedback. The goal remains
                                unchanged: make content collaboration as seamless as possible.
                            </p>

                            <p>
                                Whether you&apos;re a solo creator looking to work with your first editor, or a
                                media company managing dozens of channels, Mwarex is built to scale with you.
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="not-prose mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 text-center space-y-4">
                            <h3 className="text-2xl font-bold">Ready to Transform Your Workflow?</h3>
                            <p className="text-muted-foreground">
                                Join the platform created by Samay Samrat to revolutionize content collaboration.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link
                                    href="/auth/signup"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Get Started Free
                                </Link>
                                <Link
                                    href="/founder"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:bg-accent transition-colors"
                                >
                                    Meet the Founder
                                </Link>
                            </div>
                        </div>

                        {/* Footer */}
                        <footer className="not-prose mt-12 pt-8 border-t border-border/50 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <Link href="/founder" className="hover:text-foreground transition-colors">
                                Founder of Mwarex
                            </Link>
                            <Link href="/about" className="hover:text-foreground transition-colors">
                                About Mwarex
                            </Link>
                            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">
                                Privacy Policy
                            </Link>
                        </footer>
                    </article>
                </div>
            </main>
        </>
    );
}
