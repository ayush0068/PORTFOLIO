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

function FloatingInput({ label, name, type = "text", value, onChange, error, required }) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  return (
    <div className="relative">
      <input
        type={type} name={name} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        required={required} autoComplete="off"
        className={`w-full bg-transparent border-b px-0 pt-5 pb-2 text-white text-sm font-body outline-none transition-all duration-300
          ${error ? "border-red-500" : focused ? "border-accent" : "border-white/15 hover:border-white/30"}`}
      />
      <label className={`absolute left-0 font-body pointer-events-none transition-all duration-300
        ${focused || filled
          ? "top-0 text-[10px] uppercase tracking-widest " + (error ? "text-red-400" : focused ? "text-accent" : "text-white/30")
          : "top-4 text-sm text-white/30"}`}>
        {label}{required && <span className="text-accent ml-0.5">*</span>}
      </label>
      <div className="absolute bottom-0 left-0 h-[1px] bg-accent transition-all duration-500"
        style={{ width: focused ? "100%" : "0%" }} />
      {error && <p className="text-red-400 text-[10px] mt-1 font-body">{error}</p>}
    </div>
  );
}

function FloatingTextarea({ label, name, value, onChange, error, required }) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  return (
    <div className="relative">
      <textarea
        name={name} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        required={required} rows={4}
        className={`w-full bg-transparent border-b px-0 pt-5 pb-2 text-white text-sm font-body outline-none transition-all duration-300 resize-none
          ${error ? "border-red-500" : focused ? "border-accent" : "border-white/15 hover:border-white/30"}`}
      />
      <label className={`absolute left-0 font-body pointer-events-none transition-all duration-300
        ${focused || filled
          ? "top-0 text-[10px] uppercase tracking-widest " + (error ? "text-red-400" : focused ? "text-accent" : "text-white/30")
          : "top-4 text-sm text-white/30"}`}>
        {label}{required && <span className="text-accent ml-0.5">*</span>}
      </label>
      <div className="absolute bottom-0 left-0 h-[1px] bg-accent transition-all duration-500"
        style={{ width: focused ? "100%" : "0%" }} />
      {error && <p className="text-red-400 text-[10px] mt-1 font-body">{error}</p>}
    </div>
  );
}

function InfoCard({ icon, label, value, href, delay, inView }) {
  const content = (
    <div
      className="group flex items-center gap-3 py-3 border-b border-white/[0.05] hover:border-accent/20 transition-all duration-300 cursor-pointer"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms, border-color 0.3s`,
      }}
    >
      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
        style={{ color: "rgba(214,52,71,0.7)" }}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-widest text-white/20 font-body">{label}</p>
        <p className="text-white/65 text-xs font-body group-hover:text-white transition-colors truncate">{value}</p>
      </div>
      {href && <i className="bi bi-arrow-up-right text-white/15 group-hover:text-accent text-xs ml-auto transition-colors" />}
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noreferrer">{content}</a> : content;
}

export default function Contact() {
  const [headerRef, headerInView] = useInView(0.2);
  const [formRef, formInView]     = useInView(0.1);
  const formEl = useRef(null);

  const [fields, setFields] = useState({ from_name: "", from_email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
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
        EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID,
        formEl.current, EMAILJS_CONFIG.PUBLIC_KEY
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
    <section id="contact" className="relative bg-[#0d0d0d] py-16 sm:py-20 overflow-hidden">
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

      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "22px 22px" }} />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12">

        {/* ── Header ── */}
        <div ref={headerRef} className="mb-10 sm:mb-12 transition-all duration-700"
          style={{ opacity: headerInView ? 1 : 0, transform: headerInView ? "translateY(0)" : "translateY(24px)" }}>
          <p className="text-[11px] uppercase tracking-[0.35em] text-accent font-body mb-3 flex items-center gap-2">
            <i className="bi bi-send" /> Get in touch
          </p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="font-heading font-black text-white" style={{ fontSize: "clamp(2rem,5.5vw,4.5rem)" }}>
              Let's <span className="text-white/15">Connect</span>
            </h2>
            <p className="text-white/30 text-xs font-body max-w-xs leading-relaxed">
              Open for freelance, full-time roles, and interesting collaborations.
            </p>
          </div>
          <div className="mt-4 w-12 h-[2px] bg-accent" />
        </div>

        {/* ── Two column layout ── */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Left — Info (2 cols) */}
          <div className="lg:col-span-2">
            <InfoCard icon={<i className="bi bi-envelope-fill" />}  label="Email"    value={personal.email}    href={`mailto:${personal.email}`}  delay={80}  inView={headerInView} />
            <InfoCard icon={<i className="bi bi-telephone-fill" />} label="Phone"    value={personal.phone}    href={`tel:${personal.phone}`}     delay={160} inView={headerInView} />
            <InfoCard icon={<i className="bi bi-geo-alt-fill" />}   label="Location" value={personal.location}                                    delay={240} inView={headerInView} />
            <InfoCard icon={<i className="bi bi-linkedin" />}       label="LinkedIn" value="ayush-srivastava"  href={personal.linkedin}           delay={320} inView={headerInView} />
            {personal.github && (
              <InfoCard icon={<i className="bi bi-github" />}       label="GitHub"   value="github.com/ayush"  href={personal.github}             delay={400} inView={headerInView} />
            )}

            {/* Availability */}
            <div className="flex items-center gap-2.5 pt-5"
              style={{
                opacity: headerInView ? 1 : 0,
                transform: headerInView ? "translateY(0)" : "translateY(14px)",
                transition: "opacity 0.5s ease 480ms, transform 0.5s ease 480ms",
              }}>
              <div className="relative flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <div className="absolute inset-0 rounded-full bg-green-400"
                  style={{ animation: "ripple 1.8s ease-out infinite" }} />
              </div>
              <span className="text-green-400 text-[11px] font-body uppercase tracking-widest">
                Available for opportunities
              </span>
            </div>
          </div>

          {/* Right — Form (3 cols) */}
          <div
            ref={formRef}
            className="lg:col-span-3 transition-all duration-700 delay-150"
            style={{ opacity: formInView ? 1 : 0, transform: formInView ? "translateX(0)" : "translateX(24px)" }}
          >
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center gap-5">
                <div className="relative w-16 h-16">
                  <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                      <polyline points="6,18 14,26 30,10" stroke="#D63447" strokeWidth="3"
                        strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60"
                        style={{ animation: "checkDraw 0.6s ease 0.2s forwards", strokeDashoffset: 60 }} />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-full border border-accent/20"
                    style={{ animation: "ripple 1.5s ease-out 0.3s 2" }} />
                </div>
                <div>
                  <h3 className="font-heading font-black text-white text-xl mb-1.5">Message Sent!</h3>
                  <p className="text-white/45 text-sm font-body">
                    Thanks for reaching out. I'll reply at<br />
                    <span className="text-accent">{personal.email}</span>
                  </p>
                </div>
                <button onClick={() => setStatus("idle")}
                  className="text-[11px] uppercase tracking-widest text-white/25 hover:text-white font-body transition-colors border-b border-white/10 hover:border-white/30 pb-0.5">
                  Send another
                </button>
              </div>
            ) : (
              <form ref={formEl} onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <FloatingInput label="Your Name"  name="from_name"  value={fields.from_name}  onChange={handleChange} error={errors.from_name}  required />
                  <FloatingInput label="Your Email" name="from_email" type="email" value={fields.from_email} onChange={handleChange} error={errors.from_email} required />
                </div>

                <FloatingInput label="Subject" name="subject" value={fields.subject} onChange={handleChange} error={errors.subject} required />

                <div>
                  <FloatingTextarea label="Your Message" name="message" value={fields.message} onChange={handleChange} error={errors.message} required />
                  <div className="flex justify-end mt-1">
                    <span className={`text-[10px] font-body ${charCount > 500 ? "text-accent" : "text-white/20"}`}>
                      {charCount} chars
                    </span>
                  </div>
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-3 p-3.5 border border-red-500/30 bg-red-500/5">
                    <i className="bi bi-exclamation-triangle-fill text-red-400" />
                    <div>
                      <p className="text-red-400 text-xs font-body">Failed to send. Check EmailJS config or email directly.</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-5 pt-1">
                  <button type="submit" disabled={status === "sending"}
                    className="relative group flex items-center gap-2.5 px-7 py-3.5 bg-accent hover:bg-red-700 disabled:bg-accent/40 text-white text-xs uppercase tracking-widest font-body transition-all duration-300 overflow-hidden">
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    {status === "sending" ? (
                      <>
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <i className="bi bi-send-fill text-xs transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                  <p className="text-white/20 text-[10px] font-body tracking-widest">
                    Or email directly at<br />
                    <span className="text-accent">{personal.email}</span>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}