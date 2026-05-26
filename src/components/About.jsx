import { useEffect, useRef, useState } from "react";
import { personal, education, experience, certifications, hobbies } from "../data/data";

// Animate number counting up
function useCountUp(target, duration = 1200, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// Intersection observer hook
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// Stats bar — single stat with count-up
function Stat({ value, suffix, label, start }) {
  const count = useCountUp(value, 1200, start);
  return (
    <div className="text-center">
      <p className="font-heading font-black text-white" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>
        {count}<span className="text-accent">{suffix}</span>
      </p>
      <p className="text-white/40 text-xs uppercase tracking-widest mt-1 font-body">{label}</p>
    </div>
  );
}

// Timeline item
function TimelineItem({ item, isLast }) {
  const [ref, inView] = useInView(0.2);
  return (
    <div ref={ref} className={`flex gap-6 transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
      {/* Left dot + line */}
      <div className="flex flex-col items-center pt-1">
        <div className="w-3 h-3 rounded-full border-2 border-accent bg-[#0d0d0d] flex-shrink-0 mt-1" />
        {!isLast && <div className="w-[1px] flex-1 bg-white/10 mt-2" />}
      </div>
      {/* Content */}
      <div className={`pb-10 ${isLast ? "" : ""}`}>
        <span className="text-[11px] text-accent uppercase tracking-widest font-body">{item.duration || item.year}</span>
        <h4 className="font-heading text-white text-lg font-bold mt-1">{item.role || item.degree}</h4>
        <p className="text-white/50 text-sm font-body mt-0.5">{item.company || item.institute} — {item.location || ""}</p>
        {item.score && <p className="text-white/40 text-xs mt-1 font-body">{item.score}</p>}
        {item.points && (
          <ul className="mt-3 space-y-1">
            {item.points.map((p, i) => (
              <li key={i} className="text-white/55 text-sm font-body flex gap-2">
                <span className="text-accent mt-1 flex-shrink-0">›</span>{p}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function About() {
  const [sectionRef, sectionInView] = useInView(0.1);
  const [statsRef, statsInView]     = useInView(0.3);

  return (
    <section id="about" className="relative bg-[#0d0d0d] py-28 overflow-hidden">
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/5" />

      {/* Background texture dots */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Section header ── */}
        <div ref={sectionRef} className={`mb-20 transition-all duration-700 ${sectionInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-xs uppercase tracking-[0.35em] text-accent font-body mb-3">Get to know me</p>
          <h2 className="font-heading font-black text-white" style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>
            About <span className="text-white/20">Me</span>
          </h2>
          <div className="mt-4 w-16 h-[2px] bg-accent" />
        </div>

        {/* ── Two columns: photo + bio ── */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Photo */}
          <div className={`relative transition-all duration-700 delay-200 ${sectionInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "3/4", maxHeight: 560 }}
            >
              <img
                src={personal.suitImage}
                alt={personal.name}
                className="w-full h-full object-cover object-top"
                style={{ filter: "grayscale(20%)" }}
              />
              {/* Red accent corner */}
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-accent" />
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-accent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-4 bg-accent text-white px-5 py-4 text-center shadow-2xl">
              <p className="font-heading font-black text-3xl leading-none">8.2</p>
              <p className="text-[10px] uppercase tracking-widest mt-1 font-body opacity-90">CGPA</p>
            </div>
          </div>

          {/* Bio text */}
          <div className={`transition-all duration-700 delay-300 ${sectionInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
            <h3 className="font-heading text-white font-bold mb-6" style={{ fontSize: "clamp(1.4rem,3vw,2rem)" }}>
              Hi, I'm {personal.firstName} 👋
            </h3>
            <p className="text-white/65 font-body leading-relaxed mb-4 text-[15px]">{personal.bio}</p>
            <p className="text-white/50 font-body leading-relaxed text-[15px]">{personal.bio2}</p>

            {/* Quick info grid */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: "Location",  value: personal.location },
                { label: "Email",     value: personal.email, small: true },
                { label: "Phone",     value: personal.phone },
                { label: "Available", value: "For Freelance / Job" },
              ].map((item) => (
                <div key={item.label} className="border border-white/8 p-4 hover:border-white/20 transition-colors">
                  <p className="text-[10px] uppercase tracking-widest text-accent font-body mb-1">{item.label}</p>
                  <p className={`text-white font-body ${item.small ? "text-xs" : "text-sm"} break-all`}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Hobbies */}
            <div className="mt-8 flex gap-3 flex-wrap">
              {hobbies.map((h) => (
                <span key={h.label} className="px-4 py-2 border border-white/10 text-white/50 text-xs uppercase tracking-widest font-body hover:border-accent hover:text-white transition-all cursor-default">
                  {h.icon} {h.label}
                </span>
              ))}
            </div>

            {/* Resume button */}
            {personal.resumeLink && (
              <a
                href={personal.resumeLink}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-8 px-8 py-3 bg-accent text-white text-xs uppercase tracking-widest hover:bg-red-700 transition-all font-body"
              >
                Download CV
              </a>
            )}
          </div>
        </div>

        {/* ── Stats row ── */}
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-t border-b border-white/5 mb-24">
          <Stat value={3}   suffix="+"  label="Years Learning"    start={statsInView} />
          <Stat value={3}   suffix=""   label="Projects Built"     start={statsInView} />
          <Stat value={3}   suffix=""   label="Internships"        start={statsInView} />
          <Stat value={100} suffix="+"  label="DSA Problems Solved" start={statsInView} />
        </div>

        {/* ── Experience + Education side by side ── */}
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Experience */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-body mb-2">Work History</p>
            <h3 className="font-heading text-white font-bold text-2xl mb-10">Experience</h3>
            {experience.map((item, i) => (
              <TimelineItem key={i} item={item} isLast={i === experience.length - 1} />
            ))}
          </div>

          {/* Education */}
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-body mb-2">Academic Background</p>
            <h3 className="font-heading text-white font-bold text-2xl mb-10">Education</h3>
            {education.map((item, i) => (
              <TimelineItem key={i} item={item} isLast={i === education.length - 1} />
            ))}
          </div>
        </div>

        {/* ── Certifications ── */}
        <div className="mt-20 border-t border-white/5 pt-16">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-body mb-2">Achievements</p>
          <h3 className="font-heading text-white font-bold text-2xl mb-10">Certifications & Events</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {certifications.map((cert, i) => (
              <div key={i} className="flex gap-4 p-5 border border-white/8 hover:border-accent/40 transition-all group">
                <span className="text-accent mt-0.5 flex-shrink-0 text-lg">✦</span>
                <p className="text-white/60 text-sm font-body group-hover:text-white/80 transition-colors leading-relaxed">{cert}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}