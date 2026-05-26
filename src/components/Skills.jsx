import { useEffect, useRef, useState } from "react";
import { skills } from "../data/data";

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

const CAT_COLORS = {
  Frontend: "#D63447",
  Backend:  "#c0273a",
  Database: "#a01f2e",
  Tools:    "#e05c6e",
  Core:     "#ff6b7a",
};

// Bootstrap icon class per skill
const SKILL_ICONS = {
  "React.js":     "bi-filetype-jsx",
  "Next.js":      "bi-triangle",
  "Tailwind CSS": "bi-brush",
  "JavaScript":   "bi-filetype-js",
  "HTML5 / CSS3": "bi-filetype-html",
  "Node.js":      "bi-server",
  "Express.js":   "bi-layers",
  "REST APIs":    "bi-diagram-3",
  "JWT Auth":     "bi-shield-lock",
  "MongoDB":      "bi-database",
  "SQL":          "bi-table",
  "Git / GitHub": "bi-git",
  "DSA":          "bi-cpu",
};

// ── Animated skill row ──────────────────────────────────────
function SkillRow({ skill, inView, delay }) {
  const [hovered, setHovered] = useState(false);
  const color = CAT_COLORS[skill.category] || "#D63447";
  const icon  = SKILL_ICONS[skill.name]   || "bi-code-slash";

  return (
    <div
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity:   inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-20px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <i
            className={`bi ${icon} text-base transition-colors duration-300`}
            style={{ color: hovered ? color : "rgba(255,255,255,0.3)" }}
          />
          <span className="text-white/75 text-sm font-body group-hover:text-white transition-colors duration-300">
            {skill.name}
          </span>
          <span className="text-[10px] font-body px-1.5 py-0.5 border border-white/8 text-white/20 uppercase tracking-wider">
            {skill.category}
          </span>
        </div>
        <span
          className="font-heading font-bold text-sm tabular-nums transition-colors duration-300"
          style={{ color: hovered ? color : "rgba(255,255,255,0.25)" }}
        >
          {skill.percent}%
        </span>
      </div>

      {/* Track */}
      <div className="h-[2px] bg-white/6 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-[900ms] ease-out"
          style={{
            width: inView ? `${skill.percent}%` : "0%",
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            transitionDelay: `${delay + 150}ms`,
            boxShadow: hovered ? `0 0 8px ${color}60` : "none",
          }}
        />
      </div>
    </div>
  );
}

// ── Skill card for right grid ───────────────────────────────
function SkillCard({ skill, inView, delay, active }) {
  const [hovered, setHovered] = useState(false);
  const color = CAT_COLORS[skill.category] || "#D63447";
  const icon  = SKILL_ICONS[skill.name]   || "bi-code-slash";

  return (
    <div
      className="relative border transition-all duration-300 cursor-default group"
      style={{
        borderColor: hovered ? `${color}60` : "rgba(255,255,255,0.06)",
        background:  hovered ? `${color}08` : "transparent",
        opacity:   inView ? (active ? 1 : 0.35) : 0,
        transform: inView ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms, border-color 0.3s, background 0.3s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="p-4 flex flex-col gap-3">
        {/* Icon */}
        <div
          className="w-9 h-9 flex items-center justify-center border transition-colors duration-300"
          style={{ borderColor: hovered ? `${color}50` : "rgba(255,255,255,0.08)" }}
        >
          <i className={`bi ${icon} text-base`} style={{ color: hovered ? color : "rgba(255,255,255,0.35)" }} />
        </div>

        {/* Name + percent */}
        <div>
          <p className="text-white/80 text-xs font-body font-medium group-hover:text-white transition-colors">{skill.name}</p>
          <p className="font-heading font-black text-lg leading-none mt-1" style={{ color: hovered ? color : "rgba(255,255,255,0.15)" }}>
            {skill.percent}<span className="text-xs font-body">%</span>
          </p>
        </div>

        {/* Mini bar */}
        <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${skill.percent}%`,
              background: color,
              opacity: hovered ? 1 : 0.4,
              transition: "opacity 0.3s",
            }}
          />
        </div>
      </div>

      {/* Top accent on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-300"
        style={{ background: color, opacity: hovered ? 1 : 0 }}
      />
    </div>
  );
}

// ── Donut chart ─────────────────────────────────────────────
function DonutChart({ category, percent, color, active, onClick }) {
  const r    = 28;
  const circ = 2 * Math.PI * r;
  const [drawn, setDrawn] = useState(false);
  const [ref, inView] = useInView(0.2);
  useEffect(() => { if (inView) setTimeout(() => setDrawn(true), 200); }, [inView]);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`flex flex-col items-center gap-2 group transition-all duration-300 ${active ? "scale-105" : "hover:scale-105"}`}
    >
      <div className="relative">
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <circle
            cx="36" cy="36" r={r}
            fill="none"
            stroke={active ? color : `${color}70`}
            strokeWidth={active ? 4 : 3}
            strokeDasharray={`${drawn ? (percent / 100) * circ : 0} ${circ}`}
            strokeDashoffset={circ * 0.25}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.9s ease 0.2s, stroke 0.3s" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading font-black text-white text-sm leading-none">{percent}</span>
          <span className="text-white/20 text-[8px] font-body">avg</span>
        </div>
      </div>
      <span className={`text-[10px] uppercase tracking-widest font-body transition-colors ${active ? "text-white" : "text-white/35 group-hover:text-white/60"}`}>
        {category}
      </span>
    </button>
  );
}

// ── Main export ─────────────────────────────────────────────
export default function Skills() {
  const [headerRef, headerInView] = useInView(0.2);
  const [barsRef,   barsInView]   = useInView(0.05);
  const [cardsRef,  cardsInView]  = useInView(0.05);
  const [activeCategory, setActiveCategory] = useState(null);

  const categories  = [...new Set(skills.map(s => s.category))];
  const catStats    = categories.map(cat => {
    const cs  = skills.filter(s => s.category === cat);
    const avg = Math.round(cs.reduce((a, b) => a + b.percent, 0) / cs.length);
    return { cat, avg, count: cs.length };
  });

  const filtered = activeCategory ? skills.filter(s => s.category === activeCategory) : skills;

  const toggle = (cat) => setActiveCategory(p => p === cat ? null : cat);

  return (
    <section id="skills" className="relative bg-[#0a0a0a] py-28 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/5" />

      <style>{`
        @keyframes shine {
          from { left: -10%; }
          to   { left: 110%; }
        }
        @keyframes pulse-glow {
          0%,100% { box-shadow: 0 0 0 0 rgba(214,52,71,0); }
          50%      { box-shadow: 0 0 0 6px rgba(214,52,71,0.12); }
        }
      `}</style>

      {/* Subtle dot grid — top left only */}
      <div className="absolute top-0 left-0 w-64 h-64 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Section header ── */}
        <div
          ref={headerRef}
          className="mb-16 transition-all duration-700"
          style={{ opacity: headerInView ? 1 : 0, transform: headerInView ? "translateY(0)" : "translateY(28px)" }}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-accent font-body mb-3">What I work with</p>
          <div className="flex items-end justify-between flex-wrap gap-6">
            <h2 className="font-heading font-black text-white" style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>
              Tech <span className="text-white/20">Stack</span>
            </h2>
            <p className="text-white/30 text-sm font-body max-w-xs leading-relaxed">
              Click a category to filter skills below.
            </p>
          </div>
          <div className="mt-5 w-16 h-[2px] bg-accent" />
        </div>

        {/* ── Category donuts + filter row ── */}
        <div
          className="flex flex-wrap items-center gap-x-10 gap-y-6 mb-14 pb-10 border-b border-white/5 transition-all duration-700 delay-100"
          style={{ opacity: headerInView ? 1 : 0, transform: headerInView ? "translateY(0)" : "translateY(20px)" }}
        >
          {/* Donuts */}
          <div className="flex gap-8 flex-wrap">
            {catStats.map(({ cat, avg }) => (
              <DonutChart
                key={cat}
                category={cat}
                percent={avg}
                color={CAT_COLORS[cat] || "#D63447"}
                active={activeCategory === cat}
                onClick={() => toggle(cat)}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-[1px] h-16 bg-white/8" />

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-1.5 text-[11px] uppercase tracking-widest font-body border transition-all duration-300 ${
                !activeCategory ? "border-accent bg-accent text-white" : "border-white/10 text-white/35 hover:border-white/25 hover:text-white/60"
              }`}
            >
              All <span className="ml-1 opacity-60">{skills.length}</span>
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => toggle(cat)}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-[11px] uppercase tracking-widest font-body border transition-all duration-300 ${
                  activeCategory === cat ? "border-accent bg-accent text-white" : "border-white/10 text-white/35 hover:border-white/25 hover:text-white/60"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: CAT_COLORS[cat] }} />
                {cat}
                <span className="opacity-50">{skills.filter(s => s.category === cat).length}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Main: bars + cards ── */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left — Progress bars */}
          <div ref={barsRef} className="space-y-5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-body mb-7">
              <i className="bi bi-bar-chart-line mr-2" />Proficiency
            </p>
            {filtered.map((skill, i) => (
              <SkillRow key={skill.name} skill={skill} inView={barsInView} delay={i * 70} />
            ))}
          </div>

          {/* Right — Skill cards grid */}
          <div ref={cardsRef}>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-body mb-7">
              <i className="bi bi-grid mr-2" />Overview
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {skills.map((skill, i) => (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  inView={cardsInView}
                  delay={i * 50}
                  active={!activeCategory || activeCategory === skill.category}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Also familiar with ── */}
        <div className="mt-16 pt-12 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-body mb-5">
            <i className="bi bi-plus-circle mr-2" />Also familiar with
          </p>
          <div className="flex flex-wrap gap-2">
            {["Flutter","Angular","PHP","Django","Zustand","Postman","Vercel","Render","Mongoose","Python","Java (Android)","WebRTC"].map(tool => (
              <span
                key={tool}
                className="px-3 py-1.5 text-[11px] font-body text-white/35 border border-white/7 hover:border-accent/40 hover:text-white/65 transition-all duration-200 cursor-default"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* ── Currently learning ── */}
        <div className="mt-8 p-6 border border-accent/15 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent to-transparent" />
          {/* Shimmer sweep */}
          <div
            className="absolute top-0 bottom-0 w-1/3 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(214,52,71,0.04), transparent)",
              animation: "shine 4s ease-in-out infinite",
            }}
          />
          <div className="relative z-10 flex flex-wrap items-center gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-body mb-0.5">
                <i className="bi bi-lightning-charge-fill mr-1.5" />Currently Learning
              </p>
              <p className="text-white/25 text-xs font-body">Adding to the stack</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["TypeScript","Docker","AWS","GraphQL"].map(item => (
                <span key={item} className="flex items-center gap-1.5 px-4 py-2 bg-accent/8 border border-accent/20 text-accent/80 text-xs font-body hover:bg-accent/15 transition-colors cursor-default">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}