import { GithubIcon } from "@/components/icons/github-icon";
import { XIcon } from "@/components/icons/x-icon";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#preview", label: "Preview" },
  { href: "#proof", label: "Proof" },
];

const socialLinks = [
  {
    href: "https://x.com/samirande_",
    label: "X",
    icon: <XIcon />,
  },
  {
    href: "https://github.com/Sam721166/",
    label: "Github",
    icon: <GithubIcon />,
  },
];

export function Footer() {
  return (
    <footer className="mx-auto max-w-5xl *:px-4 *:md:px-6">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="text-lg font-bold tracking-wide hover:opacity-85 transition-opacity"
            >
              Timmo
            </a>
          </div>
          <div className="flex items-center">
            {socialLinks.map(({ href, label, icon }) => (
              <Button asChild key={label} size="icon" variant="ghost">
                <a
                  aria-label={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {icon}
                </a>
              </Button>
            ))}
          </div>
        </div>

        <nav>
          <ul className="flex flex-wrap gap-4 font-medium text-muted-foreground text-sm md:gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a className="hover:text-black" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex items-center justify-between gap-4 border-t py-4 text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Timmo. All rights reserved.</p>

        <p className="inline-flex items-center gap-1">
          <span>Built with ❤️ by</span>
          <a
            aria-label="x/twitter"
            className="inline-flex items-center gap-1 text-foreground/80 hover:text-foreground hover:underline font-semibold"
            href={"https://github.com/Sam721166"}
            rel="noreferrer"
            target="_blank"
          >
            <img
              alt="samiran"
              className="size-4 rounded-full"
              height="auto"
              src="https://github.com/Sam721166.png"
              width="auto"
            />
            Samiran De
          </a>
        </p>
      </div>
    </footer>
  );
}
