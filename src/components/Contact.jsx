import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG } from "../config/emailjs.config";
import { personal } from "../data/data";

function useInView(threshold = 0.15) {
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

// Floating label input
function FloatingInput({ label, name, type = "text", value, onChange, error, required }) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;

  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        autoComplete="off"
        className={`
          w-full bg-transparent border-b px-0 pt-6 pb-2 text-white text-sm font-body
          outline-none transition-all duration-300 peer
          ${error ? "border-red-500" : focused ? "border-accent" : "border-white/15 hover:border-white/30"}
        `}
      />
      {/* Floating label */}
      <label
        className={`
          absolute left-0 font-body pointer-events-none transition-all duration-300
          ${focused || filled
            ? "top-0 text-[10px] uppercase tracking-widest " + (error ? "text-red-400" : focused ? "text-accent" : "text-white/30")
            : "top-5 text-sm text-white/30"
          }
        `}
      >
        {label}{required && <span className="text-accent ml-0.5">*</span>}
      </label>
      {/* Animated bottom border */}
      <div
        className="absolute bottom-0 left-0 h-[1px] bg-accent transition-all duration-500"
        style={{ width: focused ? "100%" : "0%" }}
      />
      {error && <p className="text-red-400 text-[10px] mt-1 font-body">{error}</p>}
    </div>
  );
}

// Floating label textarea
function FloatingTextarea({ label, name, value, onChange, error, required }) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;

  return (
    <div className="relative">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        rows={5}
        className={`
          w-full bg-transparent border-b px-0 pt-6 pb-2 text-white text-sm font-body
          outline-none transition-all duration-300 resize-none
          ${error ? "border-red-500" : focused ? "border-accent" : "border-white/15 hover:border-white/30"}
        `}
      />
      <label
        className={`
          absolute left-0 font-body pointer-events-none transition-all duration-300
          ${focused || filled
            ? "top-0 text-[10px] uppercase tracking-widest " + (error ? "text-red-400" : focused ? "text-accent" : "text-white/30")
            : "top-5 text-sm text-white/30"
          }
        `}
      >
        {label}{required && <span className="text-accent ml-0.5">*</span>}
      </label>
      <div
        className="absolute bottom-0 left-0 h-[1px] bg-accent transition-all duration-500"
        style={{ width: focused ? "100%" : "0%" }}
      />
      {error && <p className="text-red-400 text-[10px] mt-1 font-body">{error}</p>}
    </div>
  );
}

// Info card
function InfoCard({ icon, label, value, href, delay, inView }) {
  const content = (
    <div
      className="group flex items-start gap-4 p-5 border border-white/6 hover:border-accent/30 transition-all duration-300 cursor-pointer"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, border-color 0.3s`,
      }}
    >
      <div className="w-10 h-10 border border-white/10 group-hover:border-accent/50 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-accent/5">
        <span className="text-accent text-base leading-none">{icon}</span>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/25 font-body mb-1">{label}</p>
        <p className="text-white/75 text-sm font-body group-hover:text-white transition-colors break-all">{value}</p>
      </div>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noreferrer">{content}</a>
  ) : content;
}

export default function Contact() {
  const [headerRef, headerInView] = useInView(0.2);
  const [formRef, formInView]     = useInView(0.1);
  const formEl = useRef(null);

  const [fields, setFields] = useState({ from_name: "", from_email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
    if (name === "message") setCharCount(value.length);
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!fields.from_name.trim())    errs.from_name  = "Name is required";
    if (!fields.from_email.trim())   errs.from_email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(fields.from_email)) errs.from_email = "Enter a valid email";
    if (!fields.subject.trim())      errs.subject    = "Subject is required";
    if (!fields.message.trim())      errs.message    = "Message is required";
    else if (fields.message.length < 10) errs.message = "Message too short (min 10 chars)";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus("sending");
    try {
      await emailjs.sendForm(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        formEl.current,
        EMAILJS_CONFIG.PUBLIC_KEY
      );
      setStatus("success");
      setFields({ from_name: "", from_email: "", subject: "", message: "" });
      setCharCount(0);
      setTimeout(() => setStatus("idle"), 6000);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section id="contact" className="relative bg-[#0d0d0d] py-28 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/5" />

      <style>{`
        @keyframes checkDraw {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes ripple {
          0%   { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>

      {/* Dot grid BR */}
      <div className="absolute bottom-0 right-0 w-72 h-72 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "22px 22px" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── Header ── */}
        <div ref={headerRef} className="mb-16 transition-all duration-700"
          style={{ opacity: headerInView ? 1 : 0, transform: headerInView ? "translateY(0)" : "translateY(30px)" }}>
          <p className="text-xs uppercase tracking-[0.35em] text-accent font-body mb-3">Get in touch</p>
          <div className="flex items-end justify-between flex-wrap gap-6">
            <h2 className="font-heading font-black text-white" style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>
              Let's <span className="text-white/20">Connect</span>
            </h2>
            <p className="text-white/35 text-sm font-body max-w-xs leading-relaxed">
              Open for freelance, full-time roles, and interesting collaborations.
            </p>
          </div>
          <div className="mt-5 w-16 h-[2px] bg-accent" />
        </div>

        {/* ── Two column layout ── */}
        <div className="grid lg:grid-cols-5 gap-14">

          {/* Left — Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <InfoCard icon={<i className="bi bi-envelope-fill" />}    label="Email"    value={personal.email}    href={`mailto:${personal.email}`}   delay={100} inView={headerInView} />
            <InfoCard icon={<i className="bi bi-telephone-fill" />}   label="Phone"    value={personal.phone}    href={`tel:${personal.phone}`}      delay={200} inView={headerInView} />
            <InfoCard icon={<i className="bi bi-geo-alt-fill" />}     label="Location" value={personal.location}                                     delay={300} inView={headerInView} />
            <InfoCard icon={<i className="bi bi-linkedin" />}         label="LinkedIn" value="ayush-srivastava"  href={personal.linkedin}            delay={400} inView={headerInView} />
            {personal.github && (
              <InfoCard icon={<i className="bi bi-github" />}         label="GitHub"   value="github.com/ayush"  href={personal.github}              delay={500} inView={headerInView} />
            )}

            {/* Availability badge */}
            <div
              className="flex items-center gap-3 pt-6"
              style={{
                opacity: headerInView ? 1 : 0,
                transform: headerInView ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.6s ease 600ms, transform 0.6s ease 600ms",
              }}
            >
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="absolute inset-0 rounded-full bg-green-400"
                  style={{ animation: "ripple 1.8s ease-out infinite" }} />
              </div>
              <span className="text-green-400 text-xs font-body uppercase tracking-widest">
                Available for opportunities
              </span>
            </div>
          </div>

          {/* Right — Form (3 cols) */}
          <div
            ref={formRef}
            className="lg:col-span-3 transition-all duration-700 delay-200"
            style={{ opacity: formInView ? 1 : 0, transform: formInView ? "translateX(0)" : "translateX(30px)" }}
          >
            {/* Success state */}
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center gap-6">
                <div className="relative w-20 h-20">
                  <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <polyline
                        points="6,18 14,26 30,10"
                        stroke="#D63447" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                        strokeDasharray="60"
                        style={{ animation: "checkDraw 0.6s ease 0.2s forwards", strokeDashoffset: 60 }}
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-full border border-accent/20"
                    style={{ animation: "ripple 1.5s ease-out 0.3s 2" }} />
                </div>
                <div>
                  <h3 className="font-heading font-black text-white text-2xl mb-2">Message Sent!</h3>
                  <p className="text-white/50 text-sm font-body">
                    Thanks for reaching out. I'll get back to you at<br />
                    <span className="text-accent">{personal.email}</span>
                  </p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-xs uppercase tracking-widest text-white/30 hover:text-white font-body transition-colors border-b border-white/10 hover:border-white/40 pb-0.5"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form ref={formEl} onSubmit={handleSubmit} noValidate className="space-y-8">
                {/* Row 1 — Name + Email */}
                <div className="grid sm:grid-cols-2 gap-8">
                  <FloatingInput
                    label="Your Name" name="from_name" value={fields.from_name}
                    onChange={handleChange} error={errors.from_name} required
                  />
                  <FloatingInput
                    label="Your Email" name="from_email" type="email" value={fields.from_email}
                    onChange={handleChange} error={errors.from_email} required
                  />
                </div>

                {/* Subject */}
                <FloatingInput
                  label="Subject" name="subject" value={fields.subject}
                  onChange={handleChange} error={errors.subject} required
                />

                {/* Message */}
                <div>
                  <FloatingTextarea
                    label="Your Message" name="message" value={fields.message}
                    onChange={handleChange} error={errors.message} required
                  />
                  <div className="flex justify-between mt-1">
                    <span />
                    <span className={`text-[10px] font-body ${charCount > 500 ? "text-accent" : "text-white/20"}`}>
                      {charCount} chars
                    </span>
                  </div>
                </div>

                {/* Error banner */}
                {status === "error" && (
                  <div className="flex items-center gap-3 p-4 border border-red-500/30 bg-red-500/5">
                    <i className="bi bi-exclamation-triangle-fill text-red-400 text-lg" />
                    <div>
                      <p className="text-red-400 text-sm font-body">Failed to send message.</p>
                      <p className="text-red-400/60 text-xs font-body mt-0.5">
                        Check your EmailJS config in <code>emailjs.config.js</code> or email directly.
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <div className="flex items-center gap-6 pt-2">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="relative group flex items-center gap-3 px-8 py-4 bg-accent hover:bg-red-700 disabled:bg-accent/40 text-white text-xs uppercase tracking-widest font-body transition-all duration-300 overflow-hidden"
                  >
                    {/* Shimmer on hover */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {status === "sending" ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <i className="bi bi-send-fill text-sm transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  <p className="text-white/20 text-[10px] font-body uppercase tracking-widest">
                    Powered by EmailJS
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ── Footer strip ── */}
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
          <p className="font-heading font-black text-white/15 text-xl">
            Ayush<span className="text-accent/40">.</span>
          </p>
          <p className="text-white/15 text-xs font-body uppercase tracking-widest">
            © {new Date().getFullYear()} Ayush Srivastava — Built with React + Vite
          </p>
          <div className="flex gap-6">
            {[
              { label: "LinkedIn", href: personal.linkedin },
              { label: "Email",    href: `mailto:${personal.email}` },
              ...(personal.github ? [{ label: "GitHub", href: personal.github }] : []),
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                className="text-white/20 hover:text-white text-xs uppercase tracking-widest font-body transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}