import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "MWareX | Streamline Your Video Workflow",
  description: "The ultimate platform for YouTubers and editors to collaborate seamlessly. Upload, review, approve, and publish videos with ease.",
  verification: {
    google: "1QUHEi3OUs7QONfHD6jNW2m-k_KxQRFhy61jgkbDAv4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <OnboardingProvider>
            <SmoothScrollProvider>
              <div className="min-h-screen w-full relative noise bg-white dark:bg-black">
                {/* Light Mode: Slate Radial Gradient Background */}
                <div
                  className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-500 dark:opacity-0"
                  style={{
                    background: "radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #475569 100%)",
                    transform: 'translateZ(0)', // Force GPU acceleration
                    willChange: 'opacity',
                  }}
                />
                {/* Dark Mode: X Organizations Black Background with Top Glow */}
                <div
                  className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-500 opacity-0 dark:opacity-100"
                  style={{
                    background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000",
                    transform: 'translateZ(0)', // Force GPU acceleration
                    willChange: 'opacity',
                  }}
                />
                <div className="relative z-10 flex flex-col min-h-screen">
                  {children}
                </div>
              </div>
            </SmoothScrollProvider>
          </OnboardingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
