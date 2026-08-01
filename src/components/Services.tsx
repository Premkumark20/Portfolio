import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code, Server, Cloud, CheckCircle2 } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { fetchPortfolioData } from "@/lib/csvData";
import { usePortfolio } from "@/context/PortfolioContext";

const defaultIcons = [Code, Server, Cloud];
const defaultGradients = [
  "from-blue-500 to-cyan-400",
  "from-purple-500 to-indigo-500",
  "from-cyan-400 to-emerald-400",
];

const Services: React.FC = () => {
  const { data } = usePortfolio();

  const servicesList = React.useMemo(() => {
    if (data?.servicesList && data.servicesList.length > 0) {
      return data.servicesList.map((s, idx) => ({
        domain: s.title,
        icon: defaultIcons[idx % defaultIcons.length],
        gradient: defaultGradients[idx % defaultGradients.length],
        description: s.desc,
        offerings: s.tech,
      }));
    }
    return [];
  }, [data]);

  return (
    <section id="services" className="py-12 sm:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            Services & Expertise
          </div>
          <h2 className="text-2xl sm:text-5xl font-extrabold text-white">
            Solutions & <span className="text-gradient">Capabilities</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-xs sm:text-base">
            Professional software development capabilities organized across engineering domains.
          </p>
        </motion.div>

        {/* Grouped Services Grid with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {servicesList.map((domain, idx) => {
            const Icon = domain.icon;
            return (
              <TiltCard
                key={idx}
                index={idx}
                flipDirection={idx === 0 ? "left" : idx === 2 ? "right" : "up"}
                interactiveTag="Service 3D Asset"
              >
                <div className="glass-card glass-card-hover rounded-2xl md:rounded-3xl p-5 md:p-7 border border-white/10 flex flex-col justify-between group relative overflow-hidden h-full">
                  {/* Accent Top Gradient Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${domain.gradient}`} />

                  <div>
                    {/* Domain Header */}
                    <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
                      <div className={`p-2.5 rounded-2xl bg-gradient-to-r ${domain.gradient} bg-opacity-20 text-white shadow-lg shrink-0`}>
                        <Icon className="w-4.5 h-4.5 md:w-6 md:h-6 text-white" />
                      </div>
                      <h3 className="text-base md:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                        {domain.domain}
                      </h3>
                    </div>

                    <p className="text-[11px] md:text-xs text-gray-400 mb-5 leading-relaxed">
                      {domain.description}
                    </p>

                    {/* Bulleted Offerings */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Core Capabilities</div>
                      {domain.offerings.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
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

export default Services;
