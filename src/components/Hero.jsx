export default function Hero() {
  const handleScroll = () => {
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/AYUSHIMG2.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center top",
      }}
    >
      {/* Heavy dark base overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: "rgba(0, 0, 0, 0.45)" }}
      />

      {/* 4-directional gradient — edges ko aur dark karo */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `
            linear-gradient(to right, #000 0%, transparent 25%, transparent 75%, #000 100%),
            linear-gradient(to bottom, #000 0%, transparent 10%, transparent 72%, #000 100%)
          `,
        }}
      />

      {/* Extra bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 z-[1]"
        style={{
          height: "40%",
          background: "linear-gradient(to bottom, transparent 0%, #000 100%)",
        }}
      />

      {/* Extra top fade */}
      <div
        className="absolute inset-x-0 top-0 z-[1]"
        style={{
          height: "25%",
          background: "linear-gradient(to top, transparent 0%, #000 100%)",
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <p className="fade-up fade-up-delay-1 text-xs uppercase tracking-[0.35em] text-white/70 mb-6 font-body">
          B.Tech CSE Graduate &nbsp;·&nbsp; Full Stack Developer
        </p>

        {/* Main heading */}
        <h1
          className="fade-up fade-up-delay-2 font-heading font-black leading-none mb-6"
          style={{
            fontSize: "clamp(3rem, 8vw, 7rem)",
            color: "#ffffff",
            textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)",
          }}
        >
          Ayush
          <br />
          <span
            className="text-accent"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.9)" }}
          >
            Srivastava
          </span>
        </h1>

        {/* Subheading */}
        <h2
          className="fade-up fade-up-delay-3 font-body font-light max-w-xl mx-auto"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: "rgba(255,255,255,0.85)",
            textShadow: "0 1px 10px rgba(0,0,0,0.9)",
          }}
        >
          I build modern, full-stack web experiences — from sleek UIs to robust backends.
        </h2>

        {/* CTA Buttons */}
        <div className="fade-up fade-up-delay-3 mt-10 flex gap-4 justify-center">
          <button
            onClick={() =>
              document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3 border border-white/50 text-white text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 font-body"
            style={{ textShadow: "none" }}
          >
            View Work
          </button>
          <button
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3 bg-accent text-white text-sm uppercase tracking-widest hover:bg-red-700 transition-all duration-300 font-body"
            style={{ textShadow: "none" }}
          >
            Hire Me
          </button>
        </div>
      </div>

      {/* Scroll mouse indicator */}
      <button
        onClick={handleScroll}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 group"
        aria-label="Scroll down"
      >
        <div className="w-[26px] h-[40px] rounded-full border border-white/40 flex items-start justify-center pt-2 group-hover:border-white/70 transition-colors">
          <div className="mouse-wheel w-[3px] h-[8px] rounded-full bg-white/70" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-white/50 group-hover:text-white/80 transition-colors font-body">
          Scroll
        </span>
      </button>
    </section>
  );
}