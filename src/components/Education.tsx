import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, School, Calendar } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { fetchPortfolioData } from "@/lib/csvData";
import { usePortfolio } from "@/context/PortfolioContext";

interface EducationItem {
  type: string;
  institution: string;
  location: string;
  degree: string;
  specialization: string;
  period: string;
  score: string;
  statusBadge: string;
  isPrimary: boolean;
}

const Education: React.FC = () => {
  const { data } = usePortfolio();
  const educationList = data?.educationList || [];

  return (
    <section id="education" className="py-12 sm:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            Academic History
          </div>
          <h2 className="text-2xl sm:text-5xl font-extrabold text-white">
            Education & <span className="text-gradient">Qualifications</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-xs sm:text-base">
            Academic path and academic achievements.
          </p>
        </motion.div>

        {/* Timeline Layout */}
        <div className="max-w-4xl mx-auto relative">
          
          {/* Vertical Connecting Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-500 -translate-x-1/2 block" />

          <div className="space-y-8 sm:space-y-10">
            {educationList.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center pl-10 sm:pl-0 w-full ${
                    isEven ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Center Node Dot */}
                  <div className="absolute left-4 sm:left-1/2 top-6 -translate-x-1/2 z-20 flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#050816] border-2 border-blue-500 shadow-lg shadow-blue-500/50">
                    {item.isPrimary ? (
                      <GraduationCap className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-cyan-400" />
                    ) : (
                      <School className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                    )}
                  </div>

                  {/* Card Container with 3D Tilt */}
                  <div className="w-full sm:w-[calc(50%-2.5rem)]">
                    <TiltCard
                      index={index}
                      flipDirection={isEven ? "right" : "left"}
                      interactiveTag="Timeline 3D Asset"
                    >
                      <div
                        className={`glass-card glass-card-hover rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/10 relative overflow-hidden h-full ${
                          item.isPrimary
                            ? "border-blue-500/40 shadow-xl shadow-blue-500/10 bg-gradient-to-br from-[#111827]/90 via-[#111827]/70 to-blue-950/20"
                            : ""
                        }`}
                      >
                        {/* Top Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            {item.period}
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border ${
                              item.isPrimary
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm"
                                : "bg-white/5 text-gray-300 border-white/10"
                            }`}
                          >
                            {item.statusBadge}
                          </span>
                        </div>

                        {/* Institution Title */}
                        <h3 className="text-base sm:text-xl font-bold text-white mb-1 leading-snug">
                          {item.institution}
                        </h3>
                        <div className="text-xs sm:text-sm font-semibold text-gradient-purple mb-2">
                          {item.degree}
                        </div>

                        {/* Specialization & Score */}
                        <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-400 pt-2 border-t border-white/10">
                          <span>{item.specialization}</span>
                          <span className="font-mono text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                            {item.score}
                          </span>
                        </div>

                      </div>
                    </TiltCard>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Education;