import { useState, useEffect, useRef } from "react";
import { personal } from "../data/data";

const navLinks = [
  { label: "Home",     href: "#home",      icon: "bi-house" },
  { label: "About",    href: "#about",     icon: "bi-person" },
  { label: "Projects", href: "#portfolio", icon: "bi-grid" },
  { label: "Skills",   href: "#skills",    icon: "bi-code-slash" },
  { label: "Contact",  href: "#contact",   icon: "bi-envelope" },
];

const LOGO_TEXTS = [
  { pre: "Ayush ",       accent: "Srivastava" },
  { pre: "Open To ",     accent: "Work" },
  { pre: "Full Stack ",  accent: "Developer" },
];

const SECTION_IDS = ["home", "about", "portfolio", "skills", "contact"];

// ─── CV CONFIG ───────────────────────────────────────────────
// Resume change karna ho to sirf yeh file replace karo:
// /public/resume/Ayush_Srivastava_CV.pdf
const CV_PATH     = "/resume/Ayush_Srivastava_CV.pdf";
const CV_FILENAME = "Ayush_Srivastava_CV.pdf";
// ─────────────────────────────────────────────────────────────

function downloadCV() {
  const link = document.createElement("a");
  link.href = CV_PATH;
  link.download = CV_FILENAME;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [active,      setActive]      = useState("home");
  const [logoIdx,     setLogoIdx]     = useState(0);
  const [logoVisible, setLogoVisible] = useState(true);
  const logoTimer = useRef(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const reversed = [...SECTION_IDS].reverse();
      for (const id of reversed) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    logoTimer.current = setInterval(() => {
      setLogoVisible(false);
      setTimeout(() => { setLogoIdx(p => (p + 1) % LOGO_TEXTS.length); setLogoVisible(true); }, 350);
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
      <style>{`
        @keyframes clipReveal {
          0%   { clip-path: inset(0 100% 0 0); opacity: 0; }
          100% { clip-path: inset(0 0% 0 0);   opacity: 1; }
        }
        @keyframes clipHide {
          0%   { clip-path: inset(0 0% 0 0);   opacity: 1; }
          100% { clip-path: inset(0 0 0 100%); opacity: 0; }
        }
        .logo-text { display: inline-block; white-space: nowrap; }
        .logo-text.visible { animation: clipReveal 0.45s cubic-bezier(0.77,0,0.18,1) forwards; }
        .logo-text.hidden  { animation: clipHide  0.3s  cubic-bezier(0.77,0,0.18,1) forwards; }

        @keyframes drawerIn  { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes drawerOut { from { transform: translateX(0); } to { transform: translateX(100%); } }
        .drawer-open  { animation: drawerIn  0.4s  cubic-bezier(0.4,0,0.2,1) forwards; }
        .drawer-close { animation: drawerOut 0.35s cubic-bezier(0.4,0,0.2,1) forwards; }

        @keyframes navItemIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .nav-item-anim { opacity: 0; animation: navItemIn 0.4s ease forwards; }

        @keyframes bounceIcon {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(4px); }
        }
        .cv-bounce { animation: bounceIcon 1.2s ease-in-out infinite; display: inline-block; }
      `}</style>

      {/* ── Desktop Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-black/80 backdrop-blur-md py-4 shadow-lg shadow-black/40" : "py-7 bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between relative">
          {/* Left links */}
          <ul className="hidden lg:flex gap-1 items-center">
            {navLinks.slice(0, 2).map(l => (
              <li key={l.label}>
                <button onClick={() => handleNav(l.href)}
                  className={`nav-link-item ${active === l.href.replace("#","") ? "active" : ""}`}>
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <button onClick={() => handleNav("#home")}
              className="font-heading text-2xl font-bold tracking-tight text-white overflow-hidden"
              style={{ minWidth: "220px", textAlign: "center" }}>
              <span className={`logo-text ${logoVisible ? "visible" : "hidden"}`}>
                <span className="text-white">{current.pre}</span>
                <span style={{ color: "#D63447" }}>{current.accent}</span>
              </span>
            </button>
          </div>

          {/* Right links */}
          <ul className="hidden lg:flex gap-1 items-center ml-auto">
            {navLinks.slice(2).map(l => (
              <li key={l.label}>
                <button onClick={() => handleNav(l.href)}
                  className={`nav-link-item ${active === l.href.replace("#","") ? "active" : ""}`}>
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Hamburger */}
          <button
            className="lg:hidden ml-auto flex flex-col gap-[5px] z-10 p-1"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "w-6 translate-y-[6.5px] rotate-45" : "w-6"}`} />
            <span className={`block h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "opacity-0 w-0" : "w-4"}`} />
            <span className={`block h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "w-6 -translate-y-[6.5px] -rotate-45" : "w-5"}`} />
          </button>
        </div>
      </nav>

      {/* ── Mobile Overlay ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ── */}
      {menuOpen && (
        <div
          className="drawer-open fixed top-0 right-0 h-full w-[300px] z-50 lg:hidden flex flex-col"
          style={{ background: "#0f0f0f", borderLeft: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Red accent top bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent" />

          {/* Header row */}
          <div className="flex items-center justify-between px-7 pt-8 pb-6 border-b border-white/5">
            <div>
              <p className="font-heading font-black text-white text-lg leading-tight">
                Ayush <span style={{ color: "#D63447" }}>Srivastava</span>
              </p>
              <p className="text-white/30 text-[10px] uppercase tracking-widest font-body mt-0.5">Full Stack Developer</p>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-8 h-8 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              <i className="bi bi-x-lg text-sm" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-7 py-8 overflow-y-auto">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-body mb-5">Navigation</p>
            <ul className="space-y-1">
              {navLinks.map((l, i) => {
                const isActive = active === l.href.replace("#", "");
                return (
                  <li key={l.label} className="nav-item-anim" style={{ animationDelay: `${i * 60}ms` }}>
                    <button
                      onClick={() => handleNav(l.href)}
                      className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-all duration-200 group border ${
                        isActive
                          ? "border-accent/30 bg-accent/8 text-white"
                          : "border-transparent text-white/45 hover:text-white hover:bg-white/4 hover:border-white/8"
                      }`}
                    >
                      <span className={`w-7 h-7 flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive ? "text-accent" : "text-white/25 group-hover:text-white/60"
                      }`}>
                        <i className={`bi ${l.icon} text-sm`} />
                      </span>
                      <span className="font-body text-sm uppercase tracking-widest">{l.label}</span>
                      {isActive && <span className="ml-auto w-1 h-1 rounded-full bg-accent" />}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Resume download */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-body mb-4">Resume</p>
              <button
                onClick={() => { downloadCV(); setMenuOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-3 bg-accent hover:bg-red-700 text-white transition-all duration-200 group"
              >
                <i className="bi bi-file-earmark-person text-base" />
                <span className="font-body text-sm uppercase tracking-widest">Download CV</span>
                <i className="bi bi-download ml-auto text-sm cv-bounce" />
              </button>
            </div>
          </nav>

          {/* Bottom — LinkedIn + GitHub only */}
          <div className="px-7 py-6 border-t border-white/5">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-body mb-4">Find me on</p>
            <div className="flex items-center gap-3">
              {/* LinkedIn */}
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 flex-1 px-3 py-2.5 border border-white/8 text-white/40 hover:border-[#0077B5]/60 hover:text-[#0077B5] hover:bg-[#0077B5]/5 transition-all duration-200"
              >
                <i className="bi bi-linkedin text-base" />
                <span className="font-body text-xs uppercase tracking-widest">LinkedIn</span>
              </a>

              {/* GitHub */}
              <a
                href={personal.github || "https://github.com"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 flex-1 px-3 py-2.5 border border-white/8 text-white/40 hover:border-white/30 hover:text-white hover:bg-white/4 transition-all duration-200"
              >
                <i className="bi bi-github text-base" />
                <span className="font-body text-xs uppercase tracking-widest">GitHub</span>
              </a>
            </div>

            <p className="text-white/12 text-[9px] font-body uppercase tracking-widest mt-5">
              © {new Date().getFullYear()} Ayush Srivastava
            </p>
          </div>
        </div>
      )}
    </>
  );
}