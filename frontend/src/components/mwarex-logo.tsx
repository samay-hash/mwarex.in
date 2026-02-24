import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MWareXLogoProps {
    className?: string;
    showText?: boolean;
    size?: "sm" | "md" | "lg";
    href?: string;
}

export function MWareXLogo({ className, showText = true, size = "md", href }: MWareXLogoProps) {
    const sizes = {
        sm: { w: 100, h: 60 },
        md: { w: 150, h: 90 },
        lg: { w: 200, h: 120 },
    };

    const currentSize = sizes[size] || sizes.md;

    const logoContent = (
        <div className={cn("flex items-center justify-center shrink-0", href && "cursor-pointer", className)}>
            {/* Light mode logo */}
            <Image
                src="/mwarexin.png"
                alt="MWareX Logo Light"
                width={currentSize.w}
                height={currentSize.h}
                priority
                className="object-contain dark:hidden"
            />
            {/* Dark mode logo */}
            <Image
                src="/blackmwarex.png"
                alt="MWareX Logo Dark"
                width={currentSize.w}
                height={currentSize.h}
                priority
                className="object-contain hidden dark:block"
            />
        </div>
    );

    if (href) {
        return <Link href={href}>{logoContent}</Link>;
    }

    return logoContent;
}
