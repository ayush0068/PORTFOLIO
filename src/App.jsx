import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";

// Placeholder sections so nav links don't break
const PlaceholderSection = ({ id, label }) => (
  <section
    id={id}
    className="min-h-screen flex items-center justify-center bg-[#0d0d0d] border-t border-white/5"
  >
    <p className="text-white/20 text-2xl uppercase tracking-widest font-heading">
      {label} — Coming Soon
    </p>
  </section>
);

export default function App() {
  return (
    <div className="bg-[#00000]">
      <Navbar />
      <Hero />
      <About />
      <PlaceholderSection id="portfolio" label="Projects" />
      <PlaceholderSection id="skills"    label="Skills" />
      <PlaceholderSection id="contact"   label="Contact" />
    </div>
  );
}
