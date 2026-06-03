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

// ── Skill list row (no bar) ──────────────────────────────────
function SkillLine({ skill, inView, delay }) {
  const [hovered, setHovered] = useState(false);
  const color = CAT_COLORS[skill.category] || "#D63447";
  const icon  = SKILL_ICONS[skill.name]   || "bi-code-slash";

  return (
    <div
      className="flex items-center justify-between py-2 border-b border-white/[0.03] cursor-default group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity:   inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-16px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div className="flex items-center gap-3">
        <i
          className={`bi ${icon} text-sm transition-colors duration-200`}
          style={{ color: hovered ? color : "rgba(255,255,255,0.18)" }}
        />
        <span
          className="text-sm font-body transition-colors duration-200"
          style={{ color: hovered ? "#fff" : "rgba(255,255,255,0.6)" }}
        >
          {skill.name}
        </span>
      </div>
      <span
        className="text-[11px] font-heading font-bold tabular-nums transition-colors duration-200"
        style={{ color: hovered ? color : "rgba(255,255,255,0.2)" }}
      >
        {skill.percent}%
      </span>
    </div>
  );
}

// ── Compact skill card ───────────────────────────────────────
function SkillCard({ skill, inView, delay, active }) {
  const [hovered, setHovered] = useState(false);
  const color = CAT_COLORS[skill.category] || "#D63447";
  const icon  = SKILL_ICONS[skill.name]   || "bi-code-slash";

  return (
    <div
      className="relative border transition-all duration-250 cursor-default overflow-hidden"
      style={{
        borderColor: hovered ? `${color}50` : "rgba(255,255,255,0.06)",
        background:  hovered ? `${color}06` : "transparent",
        opacity:   inView ? (active ? 1 : 0.25) : 0,
        transform: inView ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms, border-color 0.25s, background 0.25s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] transition-opacity duration-250"
        style={{ background: color, opacity: hovered ? 1 : 0 }}
      />
      <div className="p-3 flex flex-col gap-2">
        <i
          className={`bi ${icon} text-sm transition-colors duration-250`}
          style={{ color: hovered ? color : "rgba(255,255,255,0.2)" }}
        />
        <p
          className="text-[10px] font-body leading-tight transition-colors duration-200"
          style={{ color: hovered ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)" }}
        >
          {skill.name}
        </p>
        <p
          className="font-heading font-black text-base leading-none transition-colors duration-250"
          style={{ color: hovered ? color : "rgba(255,255,255,0.1)" }}
        >
          {skill.percent}<span className="text-[9px] font-body">%</span>
        </p>
      </div>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────
export default function Skills() {
  const [headerRef, headerInView] = useInView(0.2);
  const [listRef,   listInView]   = useInView(0.05);
  const [cardsRef,  cardsInView]  = useInView(0.05);
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [...new Set(skills.map(s => s.category))];
  const toggle = (cat) => setActiveCategory(p => p === cat ? null : cat);

  // Skills grouped by category for the list view
  const groupedSkills = categories.map(cat => ({
    cat,
    items: skills.filter(s => s.category === cat),
  }));

  const filteredGroups = activeCategory
    ? groupedSkills.filter(g => g.cat === activeCategory)
    : groupedSkills;

  // Running delay index across all rows
  let rowDelay = 0;

  return (
    <section id="skills" className="relative bg-[#0a0a0a] py-28 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/5" />

      {/* Subtle dot grid */}
      <div
        className="absolute top-0 left-0 w-64 h-64 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "24px 24px" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Header ── */}
        <div
          ref={headerRef}
          className="mb-14 transition-all duration-700"
          style={{ opacity: headerInView ? 1 : 0, transform: headerInView ? "translateY(0)" : "translateY(24px)" }}
        >
          <p className="text-[10px] uppercase tracking-[0.35em] text-accent font-body mb-3">
            What I work with
          </p>
          <h2 className="font-heading font-black text-white mb-5" style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>
            Tech <span className="text-white/20">Stack</span>
          </h2>
          <div className="w-10 h-[2px] bg-accent" />
        </div>

        {/* ── Filter pills ── */}
        <div
          className="flex flex-wrap gap-2 mb-12 pb-10 border-b border-white/5 transition-all duration-700 delay-100"
          style={{ opacity: headerInView ? 1 : 0, transform: headerInView ? "translateY(0)" : "translateY(16px)" }}
        >
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-body border transition-all duration-250 ${
              !activeCategory
                ? "border-accent bg-accent text-white"
                : "border-white/10 text-white/35 hover:border-white/25 hover:text-white/60"
            }`}
          >
            All <span className="ml-1 opacity-50">{skills.length}</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => toggle(cat)}
              className={`flex items-center gap-2 px-4 py-1.5 text-[10px] uppercase tracking-widest font-body border transition-all duration-250 ${
                activeCategory === cat
                  ? "border-accent bg-accent text-white"
                  : "border-white/10 text-white/35 hover:border-white/25 hover:text-white/60"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: CAT_COLORS[cat] }} />
              {cat}
              <span className="opacity-40">{skills.filter(s => s.category === cat).length}</span>
            </button>
          ))}
        </div>

        {/* ── Main: list + cards ── */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left — grouped list */}
          <div ref={listRef}>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-body mb-6">
              <i className="bi bi-list-ul mr-2" />Proficiency
            </p>
            <div className="space-y-6">
              {filteredGroups.map(({ cat, items }) => {
                const color = CAT_COLORS[cat] || "#D63447";
                return (
                  <div key={cat}>
                    {/* Category label */}
                    <div
                      className="flex items-center gap-3 mb-2"
                      style={{
                        opacity:   listInView ? 1 : 0,
                        transition: `opacity 0.4s ease ${rowDelay * 70}ms`,
                      }}
                    >
                      <span
                        className="text-[9px] uppercase tracking-widest font-body"
                        style={{ color: `${color}90` }}
                      >
                        {cat}
                      </span>
                      <div className="flex-1 h-[1px]" style={{ background: `${color}20` }} />
                    </div>
                    {items.map(skill => {
                      const d = rowDelay++ * 70;
                      return (
                        <SkillLine
                          key={skill.name}
                          skill={skill}
                          inView={listInView}
                          delay={d}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — compact cards grid */}
          <div ref={cardsRef}>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-body mb-6">
              <i className="bi bi-grid mr-2" />Overview
            </p>
            <div className="grid grid-cols-3 gap-2">
              {skills.map((skill, i) => (
                <SkillCard
                  key={skill.name}
                  skill={skill}
                  inView={cardsInView}
                  delay={i * 45}
                  active={!activeCategory || activeCategory === skill.category}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Also familiar with ── */}
        <div className="mt-14 pt-10 border-t border-white/5">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-body mb-4">
            <i className="bi bi-plus-circle mr-2" />Also familiar with
          </p>
          <div className="flex flex-wrap gap-2">
            {["Flutter","Angular","PHP","Django","Zustand","Postman","Vercel","Render","Mongoose","Python","Java (Android)","WebRTC"].map(tool => (
              <span
                key={tool}
                className="px-3 py-1.5 text-[10px] font-body text-white/30 border border-white/[0.07] hover:border-accent/35 hover:text-white/60 transition-all duration-200 cursor-default"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* ── Currently learning ── */}
        <div className="mt-6 p-5 border border-accent/15 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-accent to-transparent" />
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-accent font-body">
                <i className="bi bi-lightning-charge-fill mr-1" />Currently Learning
              </p>
              <p className="text-white/20 text-[10px] font-body mt-0.5">Adding to the stack</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["TypeScript","Docker","AWS","GraphQL"].map(item => (
                <span key={item} className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/8 border border-accent/20 text-accent/75 text-[11px] font-body hover:bg-accent/14 transition-colors cursor-default">
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