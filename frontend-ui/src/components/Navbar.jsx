import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "stats", label: "Stats" },
  { id: "features", label: "Features" },
  { id: "preview", label: "Preview" },
];

const Navbar = () => {
  const [isLoggedIn] = useState(!!localStorage.getItem("token"));
  const [active, setActive] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const visible = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.isIntersecting);
        }
        const activeId = NAV_LINKS
          .map(({ id }) => ({ id, el: document.getElementById(id) }))
          .filter(({ id, el }) => el && visible.get(id))
          .sort((a, b) => a.el.getBoundingClientRect().top - b.el.getBoundingClientRect().top)
          .map(({ id }) => id)[0];
        if (activeId) setActive(activeId);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    const sections = NAV_LINKS.map(({ id }) => document.getElementById(id)).filter(Boolean);
    sections.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-5 z-50 flex justify-center px-3 sm:top-8 sm:px-4">
      <nav className="relative flex h-12 w-full max-w-[390px] items-center justify-between rounded-full border border-neutral-200/80 bg-white/70 px-4 text-black shadow-xl shadow-black/5 backdrop-blur-2xl sm:h-14 sm:max-w-[640px] sm:px-6">
        <Link to="/" className="text-xl font-bold">
          Timmo
        </Link>

        <div className="hidden items-center justify-center gap-1 sm:flex">
          {NAV_LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${
                active === id ? "bg-[#bbf451]" : ""
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={isLoggedIn ? "/clock" : "/login"}
            className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white sm:px-5"
          >
            {isLoggedIn ? "Dashboard" : "Login"}
          </Link>

          <button
            type="button"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex size-9 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-black transition hover:bg-white sm:hidden"
          >
            {isMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] rounded-3xl border border-neutral-200/80 bg-white/95 p-2 shadow-xl shadow-black/10 backdrop-blur-2xl sm:hidden">
            {NAV_LINKS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setIsMenuOpen(false)}
                className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  active === id ? "bg-[#bbf451] text-black" : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
