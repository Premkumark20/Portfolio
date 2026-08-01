import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Eye, Briefcase, Mail, ShieldCheck, Code, Sparkles, Terminal } from "lucide-react";
import profileImage from "@/assets/profile.jpg";
import { fetchPortfolioData, PortfolioData } from "@/lib/csvData";
import { usePortfolio } from "@/context/PortfolioContext";
import { getAssetUrl } from "@/lib/utils";

const Hero: React.FC = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const { data } = usePortfolio();

  const resumeUrl = getAssetUrl("resume/Prem_Kumar_Resume.pdf");

  const primaryResume = data?.resumes?.find((r) => r.isPrimary) || data?.resumes?.[0];

  const handleResumeDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (primaryResume && primaryResume.fileData) {
      const fileUrl = getAssetUrl(primaryResume.fileData);
      const downloadName = primaryResume.name?.endsWith('.pdf') ? primaryResume.name : `${primaryResume.name || 'Prem_Kumar_Resume'}.pdf`;
      
      if (primaryResume.fileData.startsWith('data:')) {
        try {
          const link = document.createElement("a");
          link.href = primaryResume.fileData;
          link.download = downloadName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return;
        } catch {
          window.open(primaryResume.fileData, "_blank");
          return;
        }
      }

      try {
        let res = await fetch(fileUrl);
        if (!res.ok) {
          const fallbackUrl = getAssetUrl("resume.pdf");
          res = await fetch(fallbackUrl);
        }
        if (res.ok) {
          const blob = await res.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = downloadName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
          return;
        } else {
          window.open(fileUrl, "_blank");
          return;
        }
      } catch {
        window.open(fileUrl, "_blank");
        return;
      }
    }

    try {
      let res = await fetch(resumeUrl);
      if (!res.ok) {
        // Try fallback location
        const fallbackUrl = getAssetUrl("resume.pdf");
        res = await fetch(fallbackUrl);
      }
      if (!res.ok) {
        window.open(resumeUrl, "_blank");
        return;
      }
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "Prem_Kumar_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    } catch {
      window.open(resumeUrl, "_blank");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left - card.width / 2;
    const y = e.clientY - card.top - card.height / 2;
    setTilt({ x: -(y / 15), y: x / 15 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const name = data?.name || "";
  const title = data?.title || "";
  const statusBadge = data?.statusBadge || "";
  const heroTags = data?.heroTags || [];
  const bioSummary = data?.bioSummary || "";

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 pb-10 sm:pt-28 sm:pb-16 relative overflow-hidden">
      {/* Background Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Side: Professional Developer Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 sm:space-y-6 order-2 lg:order-1"
          >
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-2 rounded-full glass-card border border-emerald-500/30 shadow-lg shadow-emerald-500/10 animate-float">
              <span className="relative flex h-2 w-2 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-emerald-300 tracking-wide">
                {statusBadge}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-2">
              <div className="text-[10px] sm:text-sm font-bold tracking-widest text-cyan-400 uppercase font-mono">
                Hi, I'm
              </div>
              <h1 className="text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
                {name}
              </h1>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-0.5">
                <span className="text-base sm:text-2xl font-bold text-gradient-purple">
                  {title}
                </span>
                <span className="text-gray-500 hidden sm:inline">•</span>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {heroTags.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md text-[9px] sm:text-xs font-mono font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Professional Description */}
            <p className="text-xs sm:text-lg text-gray-300 max-w-2xl leading-relaxed font-normal">
              {bioSummary}
            </p>

            {/* Action Buttons Grid */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1 w-full max-w-full">
              <a
                href={resumeUrl}
                onClick={handleResumeDownload}
                download="Prem_Kumar_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button className="w-full sm:w-auto px-4 py-3.5 sm:px-6 sm:py-6 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Resume</span>
                </Button>
              </a>

              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <Button
                  onClick={() => scrollToSection("projects")}
                  variant="outline"
                  className="flex-1 sm:flex-none px-3 py-3.5 sm:px-6 sm:py-6 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-1.5 glass-card"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  <span>View Projects</span>
                </Button>

                <Button
                  onClick={() => scrollToSection("contact")}
                  className="flex-1 sm:flex-none px-3 py-3.5 sm:px-6 sm:py-6 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-600/25 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-1.5"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Hire Me</span>
                </Button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-6 text-[10px] sm:text-xs text-gray-400 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Backend & API Security</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span>AI Integrations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Cloud & Microservices</span>
              </div>
            </div>

          </motion.div>

          {/* Right Side: 3D Floating Glass Card Profile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 0.35, delay: 0.05, ease: [0.25, 1, 0.5, 1] }}
            className="lg:col-span-5 flex justify-center relative order-1 lg:order-2"
          >
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative group transition-transform duration-200 ease-out cursor-pointer"
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
            >
              {/* Glow Behind Image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-600 to-cyan-400 rounded-[50%] blur-3xl opacity-40 group-hover:opacity-75 transition-opacity duration-500" />

              {/* Floating Decorative Circles */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-md animate-float" />
              <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-purple-500/10 border border-purple-400/20 backdrop-blur-md animate-float [animation-delay:2s]" />

              {/* Morphing Organic Blob Container */}
              <div className="relative w-48 h-48 sm:w-80 sm:h-80 md:w-[340px] md:h-[340px] bg-gradient-to-tr from-blue-500 via-purple-500 to-cyan-400 p-[2px] sm:p-[3px] animate-morph shadow-2xl shadow-blue-500/20">
                <div className="w-full h-full bg-[#050816] animate-morph overflow-hidden p-1 sm:p-2 sm:p-2.5">
                  <img
                    src={profileImage}
                    alt="Prem Kumar K"
                    className="w-full h-full object-cover object-[center_30%] animate-morph scale-105 group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;