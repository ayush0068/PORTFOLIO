import { useEffect, useRef, useState } from "react";
import { skills } from "../data/data";

function useInView(threshold = 0.12) {
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

const CATEGORY_META = {
  Frontend: { icon: "bi-layout-text-window-reverse", color: "#c0392b" },
  Backend:  { icon: "bi-server",                     color: "#a93226" },
  Database: { icon: "bi-database",                   color: "#922b21" },
  Tools:    { icon: "bi-tools",                      color: "#b03a2e" },
  Core:     { icon: "bi-cpu",                        color: "#d44000" },
};

const SKILL_ICONS = {
  "React.js":       "bi-filetype-jsx",
  "Next.js":        "bi-triangle",
  "Tailwind CSS":   "bi-wind",
  "JavaScript":     "bi-filetype-js",
  "HTML5 / CSS3":   "bi-filetype-html",
  "Node.js":        "bi-hdd-network",
  "Express.js":     "bi-arrow-left-right",
  "REST APIs":      "bi-plug",
  "JWT Auth":       "bi-shield-lock",
  "MongoDB":        "bi-leaf",
  "SQL":            "bi-table",
  "Git / GitHub":   "bi-git",
  "DSA":            "bi-diagram-3",
};

/* ── Skill Row ── */
function SkillRow({ skill, inView, delay }) {
  const meta = CATEGORY_META[skill.category] || { color: "#c0392b" };
  const icon = SKILL_ICONS[skill.name] || "bi-code-slash";

  return (
    <div
      className="group flex items-center gap-5 py-4 border-b border-white/[0.05] last:border-0"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(14px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {/* Icon */}
      <div
        className="flex-shrink-0 w-9 h-9 flex items-center justify-center border"
        style={{ borderColor: `${meta.color}40`, background: `${meta.color}12` }}
      >
        <i className={`bi ${icon} text-sm`} style={{ color: meta.color }} />
      </div>

      {/* Name */}
      <span className="font-body text-sm text-white/60 group-hover:text-white/90 transition-colors duration-300 w-32 flex-shrink-0">
        {skill.name}
      </span>

      {/* Bar */}
      <div className="flex-1 relative h-[2px] bg-white/[0.06] overflow-visible">
        <div
          className="absolute top-0 left-0 h-full"
          style={{
            width: inView ? `${skill.percent}%` : "0%",
            background: meta.color,
            transition: `width 0.9s cubic-bezier(0.22,1,0.36,1) ${delay + 180}ms`,
          }}
        />
      </div>

      {/* Percent */}
      <span
        className="font-heading font-black text-xs tabular-nums w-9 text-right flex-shrink-0 transition-colors duration-300"
        style={{ color: `${meta.color}99` }}
      >
        {skill.percent}
      </span>
    </div>
  );
}

/* ── Category Card ── */
function CategoryCard({ cat, avg, count, color, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative text-left p-5 border transition-all duration-300 group w-full"
      style={{
        borderColor: active ? `${color}60` : "rgba(255,255,255,0.06)",
        background: active ? `${color}0e` : "transparent",
      }}
    >
      {active && (
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: color }} />
      )}
      <div className="flex items-center justify-between mb-3">
        <i
          className={`bi ${icon} text-xl`}
          style={{ color: active ? color : "rgba(255,255,255,0.2)" }}
        />
        <span
          className="font-heading font-black text-2xl leading-none"
          style={{ color: active ? color : "rgba(255,255,255,0.12)" }}
        >
          {avg}<span className="text-xs font-body font-normal">%</span>
        </span>
      </div>
      <p className="text-[11px] uppercase tracking-[0.2em] font-body"
        style={{ color: active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)" }}>
        {cat}
      </p>
      <p className="text-[10px] font-body mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>
        {count} skills
      </p>
    </button>
  );
}

/* ── Tag chip ── */
function Chip({ label }) {
  return (
    <span className="px-3 py-1.5 text-[11px] font-body text-white/35 border border-white/[0.07] hover:text-white/60 hover:border-white/20 transition-all duration-200 cursor-default">
      {label}
    </span>
  );
}

/* ── Learning badge ── */
function LearningBadge({ label }) {
  return (
    <span className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-body border"
      style={{ color: "#c0392b", borderColor: "rgba(192,57,43,0.25)", background: "rgba(192,57,43,0.06)" }}>
      <span className="w-1.5 h-1.5 rounded-full bg-[#c0392b] animate-pulse flex-shrink-0" />
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════ */
export default function Skills() {
  const [headerRef, headerInView] = useInView(0.2);
  const [barsRef,   barsInView]   = useInView(0.08);
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [...new Set(skills.map(s => s.category))];
  const categoryStats = categories.map(cat => {
    const cs = skills.filter(s => s.category === cat);
    return {
      cat,
      avg: Math.round(cs.reduce((a, b) => a + b.percent, 0) / cs.length),
      count: cs.length,
    };
  });

  const filteredSkills = activeCategory
    ? skills.filter(s => s.category === activeCategory)
    : skills;

  return (
    <section id="skills" className="relative bg-[#0a0a0a] py-28 overflow-hidden">

      {/* Top rule */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/[0.05]" />

      {/* Faint vertical lines inherited from site theme */}
      <div className="lines-bg" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

        {/* ── Header ── */}
        <div
          ref={headerRef}
          className="mb-16"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/30 font-body mb-4 flex items-center gap-2">
            <i className="bi bi-braces text-[#c0392b]" />
            Skills &amp; Stack
          </p>
          <h2
            className="font-heading font-black text-white leading-none"
            style={{ fontSize: "clamp(2.4rem,5.5vw,4.5rem)" }}
          >
            Technical<br />
            <span className="text-white/15">Expertise</span>
          </h2>
          <div className="mt-6 flex items-center gap-4">
            <div className="w-10 h-[2px] bg-[#c0392b]" />
            <p className="text-white/30 text-xs font-body">Click a category to filter</p>
          </div>
        </div>

        {/* ── Category cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-14">
          {categoryStats.map(({ cat, avg, count }) => {
            const meta = CATEGORY_META[cat] || { icon: "bi-code", color: "#c0392b" };
            return (
              <CategoryCard
                key={cat}
                cat={cat} avg={avg} count={count}
                color={meta.color} icon={meta.icon}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(p => p === cat ? null : cat)}
              />
            );
          })}
        </div>

        {/* ── Two column layout ── */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-12 items-start">

          {/* Left — Skill rows */}
          <div ref={barsRef}>
            {filteredSkills.map((skill, i) => (
              <SkillRow
                key={skill.name}
                skill={skill}
                inView={barsInView}
                delay={i * 55}
              />
            ))}
          </div>

          {/* Right — Supplementary info */}
          <div className="space-y-8 lg:sticky lg:top-28">

            {/* Also familiar with */}
            <div className="border border-white/[0.06] p-6">
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/25 font-body mb-5 flex items-center gap-2">
                <i className="bi bi-layers text-white/20" />
                Also familiar with
              </p>
              <div className="flex flex-wrap gap-2">
                {["Flutter","Angular","PHP","Django","Zustand","Postman","Vercel","Render","Mongoose","Python","Java (Android)","WebRTC"].map(t => (
                  <Chip key={t} label={t} />
                ))}
              </div>
            </div>

            {/* Currently learning */}
            <div className="relative border border-[#c0392b]/20 p-6 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#c0392b] via-[#c0392b]/40 to-transparent" />
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#c0392b]/70 font-body mb-4 flex items-center gap-2">
                <i className="bi bi-arrow-up-right-circle text-[#c0392b]" />
                Currently Learning
              </p>
              <div className="flex flex-wrap gap-2">
                {["TypeScript","Docker","AWS","GraphQL"].map(item => (
                  <LearningBadge key={item} label={item} />
                ))}
              </div>
            </div>

            {/* Stat strip */}
            <div className="grid grid-cols-3 border border-white/[0.06] divide-x divide-white/[0.06]">
              {[
                { icon: "bi-grid-3x3-gap", label: "Skills", value: skills.length },
                { icon: "bi-collection", label: "Categories", value: categories.length },
                {
                  icon: "bi-bar-chart-line",
                  label: "Avg. Level",
                  value: Math.round(skills.reduce((a,b) => a + b.percent, 0) / skills.length) + "%",
                },
              ].map(({ icon, label, value }) => (
                <div key={label} className="py-5 px-4 text-center">
                  <i className={`bi ${icon} text-white/20 text-lg block mb-2`} />
                  <p className="font-heading font-black text-white text-xl leading-none">{value}</p>
                  <p className="text-[9px] uppercase tracking-widest text-white/25 font-body mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}