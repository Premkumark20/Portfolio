import React from "react";
import ThreeBackground from "@/components/ThreeBackground";
import CustomCursor from "@/components/CustomCursor";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TechStackCarousel from "@/components/TechStackCarousel";
import About from "@/components/About";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050816] text-white relative selection:bg-blue-500/30 selection:text-blue-200">
      {/* 3D WebGL Three.js Background */}
      <ThreeBackground />

      {/* Mouse Follower Glow */}
      <CustomCursor />

      {/* Sticky Navigation */}
      <Navigation />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero />
        <TechStackCarousel />
        <About />
        <Experience />
        <Services />
        <Education />
        <Projects />
        <Skills />
        <Certifications />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
