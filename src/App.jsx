import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

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
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </div>
  );
}
