import { useEffect, useRef, useState } from "react";
import { projects } from "../data/data";

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

// GitHub SVG icon
const GithubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.04c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const ExternalIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
  </svg>
);

function ProjectCard({ project, index }) {
  const [ref, inView] = useInView(0.1);
  const [flipped, setFlipped] = useState(false);

  const tagStyle = [
    "bg-accent text-white",
    "bg-white/15 text-white/80",
    "bg-white/8 text-white/60",
  ];

  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{
        transitionDelay: `${index * 130}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(48px)",
      }}
    >
      <div
        className="relative cursor-pointer"
        style={{ perspective: "1200px", height: "440px" }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        onClick={() => setFlipped(v => !v)}
      >
        <div
          style={{
            position: "absolute", inset: 0,
            transformStyle: "preserve-3d",
            transition: "transform 0.7s cubic-bezier(0.4,0.2,0.2,1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >

          {/* ── FRONT ── */}
          <div
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            className="absolute inset-0 overflow-hidden"
          >
            {/* Image with strong dark overlay */}
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover scale-105"
              style={{ filter: "brightness(0.45) saturate(0.7)" }}
            />

            {/* Multi-layer gradient for strong bottom readability */}
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 35%, rgba(0,0,0,0.7) 65%, rgba(0,0,0,0.97) 100%)"
            }} />

            {/* Red accent left border */}
            <div className="absolute left-0 top-8 bottom-8 w-[3px] bg-accent" />

            {/* Index number — top right, faded but visible */}
            <div
              className="absolute top-5 right-6 font-heading font-black text-white/20 select-none leading-none"
              style={{ fontSize: "4.5rem" }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-7">
              {/* Tags */}
              <div className="flex gap-2 flex-wrap mb-4">
                {project.tags.map((tag, i) => (
                  <span
                    key={tag}
                    className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 font-body ${tagStyle[i % tagStyle.length]}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h3 className="font-heading font-black text-white leading-tight mb-1"
                style={{ fontSize: "clamp(1.5rem, 3vw, 1.9rem)", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
                {project.title}
              </h3>

              {/* Stack */}
              <p className="text-white/55 text-xs font-body tracking-wide mb-5">{project.stack}</p>

              {/* Hover hint line */}
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-accent" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-body">
                  Hover for details
                </span>
              </div>
            </div>
          </div>

          {/* ── BACK ── */}
          <div
            style={{
              backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            className="absolute inset-0 flex flex-col justify-between p-8 bg-[#0f0f0f]"
          >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-accent" />
            {/* Subtle left border */}
            <div className="absolute left-0 top-3 bottom-3 w-[1px] bg-accent/30" />

            {/* Blurred bg image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={project.image}
                alt=""
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.06) blur(3px)", transform: "scale(1.1)" }}
              />
            </div>

            <div className="relative z-10">
              {/* Duration badge */}
              <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-accent font-body mb-3 border border-accent/30 px-3 py-1">
                {project.duration}
              </span>

              <h3 className="font-heading font-black text-white mb-1"
                style={{ fontSize: "clamp(1.5rem, 3vw, 1.85rem)" }}>
                {project.title}
              </h3>
              <p className="text-white/40 text-xs font-body tracking-wide mb-5">{project.stack}</p>

              {/* Divider */}
              <div className="h-[1px] bg-white/8 mb-5" />

              <p className="text-white/70 text-sm font-body leading-relaxed mb-5">{project.description}</p>

              <ul className="space-y-2.5">
                {project.points.map((pt, i) => (
                  <li key={i} className="flex gap-3 text-white/55 text-xs font-body leading-relaxed">
                    <span className="text-accent flex-shrink-0 font-bold mt-0.5">›</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div className="relative z-10 flex gap-3 mt-6 flex-wrap">
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank" rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white/80 hover:border-white hover:text-white hover:bg-white/5 transition-all text-xs uppercase tracking-widest font-body"
                >
                  <GithubIcon /> GitHub
                </a>
              ) : (
                <span className="flex items-center gap-2 px-5 py-2.5 border border-white/8 text-white/25 text-xs uppercase tracking-widest font-body">
                  <GithubIcon /> Private
                </span>
              )}

              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank" rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white hover:bg-red-700 transition-all text-xs uppercase tracking-widest font-body"
                >
                  <ExternalIcon /> Live Demo
                </a>
              ) : (
                <span className="flex items-center gap-2 px-5 py-2.5 bg-accent/10 border border-accent/20 text-accent/50 text-xs uppercase tracking-widest font-body">
                  <ExternalIcon /> In Progress
                </span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [headerRef, headerInView] = useInView(0.2);

  return (
    <section id="portfolio" className="relative bg-[#080808] py-28 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/5" />

      {/* Big watermark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-heading font-black text-white/[0.018] select-none pointer-events-none"
        style={{ fontSize: "clamp(10rem,28vw,22rem)", whiteSpace: "nowrap" }}
      >
        WORK
      </div>

      {/* Dot grid */}
      <div
        className="absolute bottom-0 right-0 w-80 h-80 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "22px 22px" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div
          ref={headerRef}
          className="mb-20 transition-all duration-700"
          style={{ opacity: headerInView ? 1 : 0, transform: headerInView ? "translateY(0)" : "translateY(30px)" }}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-accent font-body mb-3">What I've built</p>
          <div className="flex items-end justify-between flex-wrap gap-6">
            <h2 className="font-heading font-black text-white" style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>
              Featured <span className="text-white/20">Projects</span>
            </h2>
            <p className="text-white/35 text-sm font-body max-w-xs leading-relaxed">
              Hover a card to flip — see details, stack & links.
            </p>
          </div>
          <div className="mt-5 w-16 h-[2px] bg-accent" />
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-14 text-center" style={{ opacity: headerInView ? 1 : 0, transition: "opacity 1s 0.6s" }}>
          <p className="text-white/15 text-xs uppercase tracking-widest font-body">
            Update <code className="text-accent/50">data.js</code> to add GitHub & live links
          </p>
        </div>
      </div>
    </section>
  );
}