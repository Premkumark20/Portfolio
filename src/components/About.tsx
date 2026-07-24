import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Award, Code2, FolderGit2, GraduationCap } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { fetchPortfolioData, PortfolioData } from "@/lib/csvData";

interface CounterProps {
  end: number;
  decimals?: number;
  suffix?: string;
}

const AnimatedCounter: React.FC<CounterProps> = ({ end, decimals = 0, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const steps = 40;
    const increment = end / steps;
    const stepTime = duration / steps;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, stepTime);

          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const defaultStatIcons = [GraduationCap, FolderGit2, Code2, Award];
const defaultColors = [
  "from-blue-500 to-cyan-400",
  "from-purple-500 to-indigo-500",
  "from-cyan-400 to-emerald-400",
  "from-amber-400 to-orange-500",
];

const About: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);

  useEffect(() => {
    fetchPortfolioData().then((data) => {
      setPortfolio(data);
    });
  }, []);

  const statsList = portfolio?.statsList && portfolio.statsList.length > 0
    ? portfolio.statsList.map((s, idx) => {
        const isCgpaCard = idx === 0 || s.label.toUpperCase().includes('CGPA');
        const valStr = (isCgpaCard && portfolio?.cgpa) ? portfolio.cgpa : s.value;
        const numVal = parseFloat(valStr);
        const decimals = valStr.includes('.') ? valStr.split('.')[1].replace(/[^0-9]/g, '').length : 0;
        return {
          label: s.label,
          value: isNaN(numVal) ? 0 : numVal,
          decimals: decimals,
          suffix: valStr.includes('+') ? '+' : '',
          icon: defaultStatIcons[idx % defaultStatIcons.length],
          subtext: s.subtext,
          color: defaultColors[idx % defaultColors.length],
        };
      })
    : [
        {
          label: "CGPA",
          value: parseFloat(portfolio?.cgpa || '0') || 0,
          decimals: portfolio?.cgpa?.includes('.') ? portfolio.cgpa.split('.')[1].replace(/[^0-9]/g, '').length : 2,
          suffix: "",
          icon: GraduationCap,
          subtext: "SRM Institute of Science & Tech",
          color: "from-blue-500 to-cyan-400",
        },
        {
          label: "Major Projects",
          value: portfolio?.projects ? portfolio.projects.length : 6,
          decimals: 0,
          suffix: "+",
          icon: FolderGit2,
          subtext: "Full Stack & Cloud Applications",
          color: "from-purple-500 to-indigo-500",
        },
        {
          label: "Technical Skills",
          value: 15,
          decimals: 0,
          suffix: "+",
          icon: Code2,
          subtext: "Python, React, FastAPI, SQL, Docker",
          color: "from-cyan-400 to-emerald-400",
        },
        {
          label: "Certifications",
          value: portfolio?.certifications ? portfolio.certifications.length : 5,
          decimals: 0,
          suffix: "+",
          icon: Award,
          subtext: "Python, SQL & Problem Solving",
          color: "from-amber-400 to-orange-500",
        },
      ];

  return (
    <section id="about" className="py-12 sm:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            About Me
          </div>
          <h2 className="text-2xl sm:text-5xl font-extrabold text-white">
            Engineering Secure, Scalable <span className="text-gradient">Software Solutions</span>
          </h2>
        </motion.div>

        {/* Clean Main Bio Card with 3D Tilt */}
        <TiltCard interactiveTag="3D Bio Asset" className="mb-8 sm:mb-12 max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-white/10 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              <h3 className="text-lg sm:text-2xl font-bold text-white">About Me</h3>
            </div>
            
            <div className="space-y-3 text-gray-300 text-xs sm:text-base leading-relaxed font-normal">
              <p>
                I'm a passionate <strong className="text-white font-semibold">Full Stack Developer</strong> with experience building secure backend systems, responsive web applications, REST APIs, and AI-powered solutions using modern technologies.
              </p>
              <p>
                I enjoy solving real-world problems through software engineering and continuously improving my skills by building practical projects.
              </p>
              <p className="text-gray-300">
                I'm currently open to <strong className="text-blue-400 font-semibold">Software Developer opportunities, freelance projects, internships, and collaborations</strong>.
              </p>
            </div>
          </div>
        </TiltCard>

        {/* Animated Statistics Cards Grid with 3D Tilt */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {statsList.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <TiltCard
                key={index}
                index={index}
                flipDirection={index % 2 === 0 ? "left" : "right"}
                interactiveTag="Metric Asset 3D"
              >
                <div className="glass-card glass-card-hover rounded-2xl p-4 sm:p-6 border border-white/10 flex flex-col items-start justify-between relative overflow-hidden group h-full">
                  <div className="flex items-center justify-between w-full mb-3 sm:mb-4">
                    <div className={`p-2.5 sm:p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-20 text-white shadow-lg`}>
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-2xl sm:text-4xl font-extrabold text-[#ffffff] tracking-tight">
                      <AnimatedCounter end={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-gray-200">
                      {stat.label}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-gray-400 font-medium pt-0.5">
                      {stat.subtext}
                    </div>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default About;