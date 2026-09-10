import React, { useState, useEffect } from "react";
import {
  Home,
  User,
  Briefcase,
  Sparkles,
  GraduationCap,
  FolderGit2,
  Cpu,
  Award,
  MessageSquare,
  Github,
  ArrowUpRight,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

const navItems = [
  { name: "Home", href: "#home", icon: Home },
  { name: "About", href: "#about", icon: User },
  { name: "Experience", href: "#experience", icon: Briefcase },
  { name: "Services", href: "#services", icon: Sparkles },
  { name: "Education", href: "#education", icon: GraduationCap },
  { name: "Projects", href: "#projects", icon: FolderGit2 },
  { name: "Skills", href: "#skills", icon: Cpu },
  { name: "Certifications", href: "#certifications", icon: Award },
  { name: "Contact", href: "#contact", icon: MessageSquare },
];

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { data: portfolio } = usePortfolio();

  const name = portfolio?.name || "";
  const title = portfolio?.title || "";
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2) : "";

  const hasExperience = portfolio?.experiences && portfolio.experiences.length > 0;
  const filteredNavItems = navItems.filter((item) => item.name !== "Experience" || hasExperience);

  const activeIndex = Math.max(
    0,
    filteredNavItems.findIndex((item) => item.href.substring(1) === activeSection)
  );

  const isClickScrollingRef = React.useRef(false);
  const clickTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // If programmatic smooth scrolling from a click is in progress, do not let intermediate scroll positions override the active section
      if (isClickScrollingRef.current) return;

      const sections = filteredNavItems.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, [hasExperience]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    setActiveSection(targetId);

    // Lock scroll tracking during click transition
    isClickScrollingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 900);

    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const ActiveIcon = filteredNavItems[activeIndex]?.icon || Home;
  const itemWidthPercent = 100 / filteredNavItems.length;
  const activeCenterPercent = (activeIndex + 0.5) * itemWidthPercent;

  return (
    <>
      {/* Top Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass-nav py-3.5 shadow-2xl shadow-black/40"
            : "bg-transparent py-4 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo PK */}
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, "#home")}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
                <div className="w-full h-full bg-[#050816] rounded-[11px] flex items-center justify-center">
                  <span className="font-extrabold text-lg text-gradient tracking-wider">
                    {initials}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xs sm:text-sm tracking-wide text-white group-hover:text-blue-400 transition-colors">
                  {name}
                </span>
                <span className="text-[9px] sm:text-[10px] text-gray-400 tracking-wider uppercase font-medium">
                  {title}
                </span>
              </div>
            </a>

            {/* Desktop Nav Items */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#111827]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-xl">
              {filteredNavItems.map((item) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 relative ${
                      isActive
                        ? "text-white bg-blue-600/30 border border-blue-500/40 shadow-sm"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.name}
                  </a>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="https://github.com/Premkumark20"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300"
              >
                <Github className="w-3.5 h-3.5 text-blue-400" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3 h-3 text-gray-400" />
              </a>

              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className="px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-md shadow-blue-500/25 transition-all duration-300 hover:scale-105"
              >
                Hire Me
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Icon Navigation Taskbar with Fluid Curved Notch */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 w-full bg-[#0a0f1d] pb-[max(0.2rem,env(safe-area-inset-bottom))] shadow-[0_-12px_32px_rgba(0,0,0,0.7)]"
      >
        {/* Continuous top blue border line across the entire bar */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.5)] z-10" />

        <div className="relative max-w-lg mx-auto w-full">
          
          {/* Animated Curved Notch Scoop and Active Downside Triangle Indicator */}
          <div
            className="absolute top-0 pointer-events-none transition-all duration-300 ease-out z-30 flex flex-col items-center"
            style={{
              left: `${activeCenterPercent}%`,
              transform: "translateX(-50%)",
            }}
          >
            {/* SVG Notch Scoop cleanly opening the dip in the top line with zero artifacts */}
            <svg
              className="absolute top-0 overflow-visible pointer-events-none"
              width="80"
              height="40"
              viewBox="0 0 80 40"
            >
              {/* Mask strictly between x=0 and x=80 from y=-3 down to curve, removing ANY line crossing behind the triangle */}
              <path
                d="M 0 -3 L 80 -3 L 80 1 C 62 1 56 37 40 37 C 24 37 18 1 0 1 Z"
                fill="#050816"
              />
              {/* Continuous curved rim stroke aligned with the 2px line center (y=1) with extended wings */}
              <path
                d="M -12 1 L 0 1 C 18 1 24 37 40 37 C 56 37 62 1 80 1 L 92 1"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {/* Active Downside Triangle Badge - Top quarter raised out of line with increased height & even margins */}
            <div className="relative -top-3 flex items-center justify-center filter drop-shadow-[0_4px_16px_rgba(6,182,212,0.7)]">
              <svg width="40" height="38" viewBox="0 0 40 38" className="overflow-visible">
                <defs>
                  <linearGradient id="downTriangleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
                {/* Smooth Downward Triangle with rounded corners and increased height */}
                <path
                  d="M 7 4 L 33 4 C 37 4 38.5 8 36.5 13 L 23 33.5 C 21.5 36 18.5 36 17 33.5 L 3.5 13 C 1.5 8 3 4 7 4 Z"
                  fill="url(#downTriangleGrad)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pb-2">
                <ActiveIcon className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
            </div>
          </div>

          {/* Navigation Icon Slots */}
          <div className="flex items-center justify-around w-full h-11 relative z-20">
            {filteredNavItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = idx === activeIndex;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  aria-label={item.name}
                  title={item.name}
                  className="group relative flex flex-col items-center justify-center flex-1 h-full focus:outline-none select-none"
                >
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 ${
                      isActive
                        ? "opacity-0 pointer-events-none"
                        : "text-gray-400 hover:text-cyan-300 hover:bg-white/5 opacity-100"
                    }`}
                  >
                    <Icon className="w-[19px] h-[19px] stroke-[1.8]" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;