import { lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/shared/Navbar";
import Hero from "@/features/hero/Hero";

const About = lazy(() => import("@/features/about/About"));
const Skills = lazy(() => import("@/features/skills/Skills"));
const Projects = lazy(() => import("@/features/projects/Projects"));
const Education = lazy(() => import("@/features/education/Education"));
const Experience = lazy(() => import("@/features/experience/Experience"));
const Certifications = lazy(() => import("@/features/certifications/Certifications"));
const Contact = lazy(() => import("@/features/contact/Contact"));
const Footer = lazy(() => import("@/features/footer/Footer"));

// We will also import a dynamic Resumes section later
const Resumes = lazy(() => import("@/features/resumes/Resumes"));

function Loader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

function Divider() {
  return <div className="section-divider" />;
}

export default function PortfolioHome({ theme, setTheme }) {
  const navigate = useNavigate();

  useEffect(() => {
    let keys = "";
    const handleKeyDown = (e) => {
      // Ignore if user is typing in form inputs
      if (
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA"
      ) {
        return;
      }
      keys += e.key.toLowerCase();
      if (keys.length > 5) {
        keys = keys.slice(-5);
      }
      if (keys === "admin") {
        navigate("/admin/login");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <div className="noise-overlay relative min-h-screen bg-surface-900 text-text-200">
      <Navbar theme={theme} setTheme={setTheme} />

      <main>
        <Hero />
        <Suspense fallback={<Loader />}>
          <Divider />
          <About />
          <Divider />
          <Skills />
          <Divider />
          <Resumes /> {/* Render dynamic Resumes list */}
          <Divider />
          <Projects />
          <Divider />
          <Education />
          <Divider />
          <Experience />
          <Divider />
          <Certifications />
          <Divider />
          <Contact />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}
