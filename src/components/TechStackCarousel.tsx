import React from "react";
import { Code } from "lucide-react";

const techList = [
  "Python",
  "React",
  "FastAPI",
  "Flask",
  "Docker",
  "Git",
  "GitHub",
  "JavaScript",
  "HTML",
  "CSS",
  "Bootstrap",
  "Redis",
  "PostgreSQL",
  "MySQL",
  "SQLite",
  "Google Cloud",
  "Ethereum",
];

const TechStackCarousel: React.FC = () => {
  return (
    <section className="py-8 relative z-10 border-y border-white/10 bg-[#050816]/80 backdrop-blur-md overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
        <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest font-semibold">
          Core Technologies & Ecosystem
        </span>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative flex overflow-x-hidden">
        
        {/* Left/Right Fade Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050816] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050816] to-transparent z-20 pointer-events-none" />

        {/* Marquee Items Loop */}
        <div className="animate-marquee flex items-center gap-4">
          {[...techList, ...techList].map((tech, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-400/30 transition-all duration-200 shrink-0 group cursor-default"
            >
              <Code className="w-3.5 h-3.5 text-blue-400 group-hover:text-cyan-300" />
              <span className="text-xs font-semibold font-mono text-gray-200 group-hover:text-white">
                {tech}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TechStackCarousel;
