import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, MapPin, Building2, ChevronDown, ChevronUp, ArrowUpRight, X, Sparkles, CheckCircle2 } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { ExperienceItem } from "@/lib/csvData";
import { TiltCard } from "@/components/ui/TiltCard";
import { capitalizeWords } from "@/lib/utils";

const gradients = [
  "from-blue-600 to-indigo-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-purple-600 to-pink-600",
  "from-amber-500 to-orange-600",
];

const Experience: React.FC = () => {
  const { data } = usePortfolio();
  const experiences = data?.experiences || [];

  const [showAll, setShowAll] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceItem | null>(null);

  const visibleExperiences = showAll ? experiences : experiences.slice(0, 3);

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="py-12 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden z-10">
      {/* Background Glows */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s" }}></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-l from-cyan-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: "8s", animationDelay: "1s" }}></div>
      </div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          Career Milestones
        </div>
        <h2 className="text-2xl sm:text-5xl font-extrabold text-white">
          Work <span className="text-gradient">Experience</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-xs sm:text-base">
          Roles and responsibilities that shaped my engineering skills.
        </p>
      </motion.div>

      {/* 3-Column Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 relative z-10">
        {visibleExperiences.map((exp, index) => {
          const grad = exp.gradient || gradients[index % gradients.length];
          const formattedRole = capitalizeWords(exp.role);
          const formattedCompany = capitalizeWords(exp.company);
          const formattedLocation = exp.location ? capitalizeWords(exp.location) : "";
          const formattedDuration = exp.duration ? capitalizeWords(exp.duration) : "";

          return (
            <TiltCard
              key={`${exp.role}-${index}`}
              index={index}
              flipDirection={index % 2 === 0 ? "left" : "right"}
              interactiveTag="Experience 3D Asset"
              onClick={() => setSelectedExperience(exp)}
            >
              <div className="glass-card glass-card-hover rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/10 flex flex-col justify-between group cursor-pointer relative overflow-hidden h-full">
                {/* Top Accent Gradient Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${grad}`} />

                <div className="space-y-4">
                  {/* Top Bar: Icon & Company Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r ${grad} text-white shadow-md`}>
                      <Briefcase className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                    </div>
                    <Badge variant="secondary" className="text-xs bg-blue-500/15 text-blue-300 border border-blue-500/30 font-semibold font-mono truncate max-w-[60%]">
                      {formattedCompany}
                    </Badge>
                  </div>

                  {/* Title & Metadata */}
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                      {formattedRole}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-400 mt-2">
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-blue-400" />
                        {formattedCompany}
                      </span>
                      {formattedLocation && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          {formattedLocation}
                        </span>
                      )}
                      {formattedDuration && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          {formattedDuration}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-4">
                    {exp.summary}
                  </p>
                </div>

                {/* Card Footer: Tech Tags & View Details Button */}
                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
                    {(exp.tags || []).slice(0, 3).map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-mono bg-white/5 text-gray-300 border border-white/10"
                      >
                        {capitalizeWords(t)}
                      </span>
                    ))}
                    {(exp.tags || []).length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        +{(exp.tags || []).length - 3}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedExperience(exp);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-white transition-colors shrink-0"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </TiltCard>
          );
        })}
      </div>

      {/* View All / View Less Toggle Button */}
      {experiences.length > 3 && (
        <div className="mt-10 text-center relative z-20">
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            className="px-8 py-5 rounded-2xl font-semibold text-white bg-[#111827]/80 hover:bg-[#111827] border-white/15 hover:border-blue-400/50 shadow-xl gap-2 transition-all duration-300 cursor-pointer"
          >
            <span>{showAll ? "Show Top 3 Experiences" : "View All Experiences"}</span>
            {showAll ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4 text-blue-400" />}
          </Button>
        </div>
      )}

      {/* Experience Detail Lightbox Modal */}
      {selectedExperience && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#050816]/95 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setSelectedExperience(null)}
        >
          <div
            className="glass-card rounded-3xl max-w-2xl w-full border border-white/15 overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto relative bg-[#111827]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
                  {capitalizeWords(selectedExperience.company)}
                  {selectedExperience.location ? ` • ${capitalizeWords(selectedExperience.location)}` : ''}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1 leading-snug">
                  {capitalizeWords(selectedExperience.role)}
                </h3>
              </div>
              <button
                onClick={() => setSelectedExperience(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white shrink-0 ml-4 transition-colors"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Duration & Metadata Bar */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-white">{capitalizeWords(selectedExperience.company)}</span>
              </div>
              {selectedExperience.duration && (
                <div className="flex items-center gap-1.5 text-blue-300 font-mono font-semibold bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-500/20">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  <span>{capitalizeWords(selectedExperience.duration)}</span>
                </div>
              )}
            </div>

            {/* Detailed Responsibilities & Summary */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Key Responsibilities & Impact
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {selectedExperience.summary}
              </p>
            </div>

            {/* Tech Stack */}
            {(selectedExperience.tags || []).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider">Technologies & Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedExperience.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-xl text-xs font-mono font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20"
                    >
                      {capitalizeWords(t)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedExperience(null)}
                className="px-6 py-2.5 rounded-xl text-sm font-medium border-white/15 text-gray-300 hover:text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default Experience;