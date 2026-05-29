import { useEffect, useRef, useState } from "react";
import { personal } from "../data/data";

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

const NAV_LINKS = [
  { label: "Home",     href: "#home" },
  { label: "About",    href: "#about" },
  { label: "Projects", href: "#portfolio" },
  { label: "Skills",   href: "#skills" },
  { label: "Contact",  href: "#contact" },
];

const SOCIAL = [
  { icon: "bi-github",   href: "github",   label: "GitHub" },
  { icon: "bi-linkedin", href: "linkedin", label: "LinkedIn" },
  { icon: "bi-envelope", href: "email",    label: "Email" },
];

const STACK = ["React.js", "Node.js", "MongoDB", "Express.js", "Tailwind CSS"];

export default function Footer() {
  const [rootRef, inView] = useInView(0.05);
  const [year] = useState(new Date().getFullYear());
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleNav = (href) => {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEmail = () => {
    navigator.clipboard.writeText(personal.email || "ayushrivastava0018@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const getSocialHref = (key) => {
    if (key === "email") return `mailto:${personal.email || "ayushrivastava0018@gmail.com"}`;
    return personal[key] || "#";
  };

  return (
    <footer
      ref={rootRef}
      className="relative bg-[#0a0a0a] overflow-hidden"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <style>{`
        /* Number counter roll */
        @keyframes rollIn {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        /* Stagger reveal */
        .footer-reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .footer-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Social icon */
        .f-social {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px; height: 40px;
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.35);
          font-size: 1rem;
          text-decoration: none;
          transition: color 0.25s, border-color 0.25s, transform 0.25s;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .f-social::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #D63447;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
          z-index: 0;
        }
        .f-social:hover::before { transform: scaleY(1); }
        .f-social:hover {
          color: #fff;
          border-color: #D63447;
          transform: translateY(-3px);
        }
        .f-social i { position: relative; z-index: 1; }

        /* Nav link */
        .f-nav-link {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
          font-family: inherit;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .f-nav-link::before {
          content: '';
          display: block;
          width: 0;
          height: 1px;
          background: #D63447;
          transition: width 0.3s ease;
          flex-shrink: 0;
        }
        .f-nav-link:hover { color: rgba(255,255,255,0.9); }
        .f-nav-link:hover::before { width: 16px; }

        /* Stack pill */
        .stack-pill {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 4px 10px;
          font-family: inherit;
          transition: color 0.2s, border-color 0.2s;
          white-space: nowrap;
        }
        .stack-pill:hover {
          color: rgba(255,255,255,0.6);
          border-color: rgba(255,255,255,0.15);
        }

        /* Big name watermark scroll */
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 18s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover { animation-play-state: paused; }

        /* Availability pulse */
        @keyframes availPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.85); }
        }
        .avail-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #22c55e;
          animation: availPulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        /* Copy email flash */
        .copy-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: rgba(255,255,255,0.35);
          font-size: 11px;
          letter-spacing: 0.1em;
          font-family: inherit;
          transition: color 0.2s;
        }
        .copy-btn:hover { color: rgba(255,255,255,0.7); }

        /* Bottom bar divider */
        .footer-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent);
        }
      `}</style>

      {/* ── Scrolling name marquee ── */}
      <div
        className="relative overflow-hidden py-3 sm:py-5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.04)" }}
      >
        <div className="marquee-track select-none" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="flex items-center gap-6 pr-6">
              <span
                className="font-heading font-black whitespace-nowrap"
                style={{
                  fontSize: "clamp(1.6rem, 5vw, 5rem)",
                  color: i % 2 === 0 ? "rgba(255,255,255,0.04)" : "transparent",
                  WebkitTextStroke: i % 2 === 1 ? "1px rgba(255,255,255,0.07)" : "none",
                  letterSpacing: "0.05em",
                }}
              >
                Ayush Srivastava
              </span>
              <span style={{ color: "#D63447", fontSize: "1.5rem", opacity: 0.3 }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-10">

        {/* Mobile: brand row + social in one line, then nav horizontal */}
        {/* Desktop: 3 column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr_1fr] gap-8 lg:gap-16">

          {/* Col 1 — Brand + availability + email */}
          <div
            className="footer-reveal"
            style={{ transitionDelay: "0ms" }}
            ref={el => { if (el && inView) el.classList.add("visible"); }}
          >
            {/* Mobile: brand + social side by side */}
            <div className="flex items-start justify-between gap-4 lg:block">
              {/* Name */}
              <div className="mb-0 lg:mb-6">
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-body mb-2 lg:mb-3">
                  Portfolio
                </p>
                <h2 className="font-heading font-black text-white leading-none"
                  style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.8rem)" }}>
                  Ayush<br />
                  <span style={{ color: "#D63447" }}>Srivastava</span>
                </h2>
              </div>

              {/* Social icons — visible on mobile here, hidden on desktop (shown in col3) */}
              <div className="flex flex-col gap-2 lg:hidden flex-shrink-0">
                {SOCIAL.map(s => (
                  <a
                    key={s.label}
                    href={getSocialHref(s.href)}
                    target={s.href !== "email" ? "_blank" : undefined}
                    rel="noreferrer"
                    className="f-social"
                    aria-label={s.label}
                    onClick={s.href === "email" ? (e) => { e.preventDefault(); handleEmail(); } : undefined}
                  >
                    <i className={`bi ${s.icon}`} />
                  </a>
                ))}
              </div>
            </div>

            {/* Tagline — hidden on mobile to save space */}
            <p className="hidden sm:block text-white/30 text-sm font-body leading-relaxed mt-5 mb-6 max-w-xs">
              Full Stack Developer crafting scalable web experiences — clean code, thoughtful UI.
            </p>

            {/* Availability + email — compact on mobile */}
            <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row lg:flex-col gap-3 sm:items-center lg:items-start sm:gap-6 lg:gap-4">
              <div className="flex items-center gap-3">
                <span className="avail-dot" />
                <span className="text-[11px] uppercase tracking-[0.2em] font-body text-white/40">
                  Available for work
                </span>
              </div>
              <button onClick={handleEmail} className="copy-btn">
                <i className={`bi ${copiedEmail ? "bi-check2" : "bi-envelope"} text-sm`}
                  style={{ color: copiedEmail ? "#22c55e" : undefined }} />
                <span style={{ color: copiedEmail ? "#22c55e" : undefined }}>
                  {copiedEmail ? "Copied!" : (personal.email || "ayushrivastava0018@gmail.com")}
                </span>
              </button>
            </div>
          </div>

          {/* Col 2 — Navigation: horizontal scrollable on mobile, vertical on desktop */}
          <div
            className="footer-reveal"
            style={{ transitionDelay: "120ms" }}
            ref={el => { if (el && inView) el.classList.add("visible"); }}
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-body mb-4 lg:mb-7">
              Navigate
            </p>
            {/* Mobile: horizontal pill nav */}
            <div className="flex lg:hidden flex-wrap gap-2">
              {NAV_LINKS.map(l => (
                <button key={l.label} onClick={() => handleNav(l.href)}
                  className="text-[10px] uppercase tracking-[0.15em] font-body px-3 py-1.5 border text-white/35 hover:text-white/80 transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  {l.label}
                </button>
              ))}
            </div>
            {/* Desktop: vertical list */}
            <ul className="hidden lg:block space-y-4">
              {NAV_LINKS.map(l => (
                <li key={l.label}>
                  <button onClick={() => handleNav(l.href)} className="f-nav-link">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Connect + stack: hidden on mobile (social moved to col1), visible desktop */}
          <div
            className="footer-reveal hidden lg:block"
            style={{ transitionDelay: "240ms" }}
            ref={el => { if (el && inView) el.classList.add("visible"); }}
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-body mb-7">
              Connect
            </p>
            <div className="flex gap-3 mb-10">
              {SOCIAL.map(s => (
                <a
                  key={s.label}
                  href={getSocialHref(s.href)}
                  target={s.href !== "email" ? "_blank" : undefined}
                  rel="noreferrer"
                  className="f-social"
                  aria-label={s.label}
                  onClick={s.href === "email" ? (e) => { e.preventDefault(); handleEmail(); } : undefined}
                >
                  <i className={`bi ${s.icon}`} />
                </a>
              ))}
            </div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-body mb-4">
              Built with
            </p>
            <div className="flex flex-wrap gap-2">
              {STACK.map(s => (
                <span key={s} className="stack-pill">{s}</span>
              ))}
            </div>
          </div>

          {/* Stack pills — mobile only, below nav */}
          <div className="lg:hidden footer-reveal" style={{ transitionDelay: "200ms" }}
            ref={el => { if (el && inView) el.classList.add("visible"); }}>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-body mb-3">
              Built with
            </p>
            <div className="flex flex-wrap gap-2">
              {STACK.map(s => (
                <span key={s} className="stack-pill">{s}</span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-divider" />
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/18 font-body">
          © {year} Ayush Srivastava
        </p>
        <div className="hidden sm:block flex-1 mx-8 h-[1px]"
          style={{ background: "linear-gradient(to right, transparent, rgba(214,52,71,0.3), transparent)" }} />
        <p className="text-[10px] uppercase tracking-[0.25em] font-body flex items-center gap-2"
          style={{ color: "rgba(255,255,255,0.15)" }}>
          Designed &amp; Built by
          <span style={{ color: "#D63447" }}>Ayush</span>
        </p>
      </div>
    </footer>
  );
}