import { useState, useEffect, useRef } from "react";

const navLinks = [
  { label: "Home",    href: "#home" },
  { label: "About",   href: "#about" },
  { label: "Projects",href: "#portfolio" },
  { label: "Skills",  href: "#skills" },
  { label: "Contact", href: "#contact" },
];

// Logo cycles through these every 5 seconds
const LOGO_TEXTS = [
  { pre: "Ayush ", accent: "Srivastava" },
  { pre: "Open To ", accent: "Work" },
  { pre: "Full Stack ", accent: "Developer" },
];

// Never mutate this — used in scroll handler
const SECTION_IDS = ["home", "about", "portfolio", "skills", "contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive]     = useState("home");

  // Logo rotator state
  const [logoIdx, setLogoIdx]       = useState(0);
  const [logoVisible, setLogoVisible] = useState(true); // for fade/slide
  const logoTimer = useRef(null);

  // ── Active section tracking (fixed: no .reverse() mutation) ──
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      // Iterate reversed copy so we find the deepest visible section
      const reversed = [...SECTION_IDS].reverse();
      for (const id of reversed) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Logo text rotator ──
  useEffect(() => {
    logoTimer.current = setInterval(() => {
      // Fade/slide out
      setLogoVisible(false);
      setTimeout(() => {
        setLogoIdx((prev) => (prev + 1) % LOGO_TEXTS.length);
        // Fade/slide in
        setLogoVisible(true);
      }, 350); // matches CSS transition duration
    }, 5000);

    return () => clearInterval(logoTimer.current);
  }, []);

  const handleNav = (href) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const current = LOGO_TEXTS[logoIdx];

  return (
    <>
      {/* ── Keyframe + transition styles injected once ── */}
      <style>{`
        @keyframes clipReveal {
          0%   { clip-path: inset(0 100% 0 0); opacity: 0; }
          100% { clip-path: inset(0 0% 0 0);   opacity: 1; }
        }
        @keyframes clipHide {
          0%   { clip-path: inset(0 0% 0 0);   opacity: 1; }
          100% { clip-path: inset(0 0 0 100%); opacity: 0; }
        }
        .logo-text {
          display: inline-block;
          white-space: nowrap;
        }
        .logo-text.visible {
          animation: clipReveal 0.45s cubic-bezier(0.77,0,0.18,1) forwards;
        }
        .logo-text.hidden {
          animation: clipHide 0.3s cubic-bezier(0.77,0,0.18,1) forwards;
        }
      `}</style>

      {/* ── Desktop Navbar ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/80 backdrop-blur-md py-4 shadow-lg shadow-black/40"
            : "py-7 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between relative">
          {/* Left links */}
          <ul className="hidden lg:flex gap-1 items-center">
            {navLinks.slice(0, 2).map((l) => (
              <li key={l.label}>
                <button
                  onClick={() => handleNav(l.href)}
                  className={`nav-link-item ${active === l.href.replace("#", "") ? "active" : ""}`}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Logo — centered absolute, animated */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <button
              onClick={() => handleNav("#home")}
              className="font-heading text-2xl font-bold tracking-tight text-white overflow-hidden"
              style={{ minWidth: "220px", textAlign: "center" }}
            >
              <span className={`logo-text ${logoVisible ? "visible" : "hidden"}`}>
                <span className="text-white">{current.pre}</span>
                <span style={{ color: "#e53e3e" }}>{current.accent}</span>
              </span>
            </button>
          </div>

          {/* Right links */}
          <ul className="hidden lg:flex gap-1 items-center ml-auto">
            {navLinks.slice(2).map((l) => (
              <li key={l.label}>
                <button
                  onClick={() => handleNav(l.href)}
                  className={`nav-link-item ${active === l.href.replace("#", "") ? "active" : ""}`}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Hamburger — mobile */}
          <button
            className="lg:hidden ml-auto flex flex-col gap-[5px] z-10"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-[1.5px] bg-white transition-all duration-300 ${
                menuOpen ? "w-6 translate-y-[6.5px] rotate-45" : "w-6"
              }`}
            />
            <span
              className={`block h-[1.5px] bg-white transition-all duration-300 ${
                menuOpen ? "opacity-0 w-0" : "w-4"
              }`}
            />
            <span
              className={`block h-[1.5px] bg-white transition-all duration-300 ${
                menuOpen ? "w-6 -translate-y-[6.5px] -rotate-45" : "w-5"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""} lg:hidden`}>
        <p className="font-heading text-2xl font-bold text-white mb-10">
          Ayush <span style={{ color: "#e53e3e" }}>Srivastava</span>
        </p>
        <ul className="flex flex-col gap-6">
          {navLinks.map((l) => (
            <li key={l.label}>
              <button
                onClick={() => handleNav(l.href)}
                className="text-white/80 hover:text-white text-lg uppercase tracking-widest font-light transition-colors"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="absolute bottom-10 left-10 text-xs text-white/30 tracking-widest uppercase">
          Full Stack Developer
        </div>
      </div>
    </>
  );
}