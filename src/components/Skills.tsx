import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Layout, Server, Database, Wrench } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { fetchPortfolioData } from "@/lib/csvData";

interface SkillCategory {
  title: string;
  icon: any;
  gradient: string;
  skills: string[];
}

const defaultCategoryIcons = [Terminal, Layout, Server, Database, Wrench];
const defaultCategoryGradients = [
  "from-blue-500 to-cyan-400",
  "from-cyan-400 to-teal-400",
  "from-purple-500 to-indigo-500",
  "from-indigo-400 to-purple-400",
  "from-amber-400 to-orange-500",
];

const Skills: React.FC = () => {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);

  useEffect(() => {
    fetchPortfolioData().then((data) => {
      if (data.skillsList && data.skillsList.length > 0) {
        const mapped = data.skillsList.map((s, idx) => ({
          title: s.category,
          icon: defaultCategoryIcons[idx % defaultCategoryIcons.length],
          gradient: defaultCategoryGradients[idx % defaultCategoryGradients.length],
          skills: s.skills,
        }));
        setSkillCategories(mapped);
      }
    });
  }, []);

  return (
    <section id="skills" className="py-12 sm:py-24 relative z-10">
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
            Technical Competencies
          </div>
          <h2 className="text-2xl sm:text-5xl font-extrabold text-white">
            Tech Stack & <span className="text-gradient">Skills</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-xs sm:text-base">
            Core programming languages, frameworks, databases, and development tools.
          </p>
        </motion.div>

        {/* Sleek Skill Cards Grid with 3D Tilt */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {skillCategories.map((cat, idx) => {
            const Icon = cat.icon;
            const isLastOdd = idx === skillCategories.length - 1 && skillCategories.length % 2 !== 0;

            return (
              <div
                key={idx}
                className={isLastOdd ? "col-span-2 lg:col-span-1 w-full lg:max-w-none" : "col-span-1"}
              >
                <TiltCard
                  index={idx}
                  flipDirection={idx % 2 === 0 ? "left" : "right"}
                  interactiveTag="Skill Asset 3D"
                >
                  <div className="glass-card glass-card-hover rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/10 flex flex-col justify-between group relative overflow-hidden h-full">
                    {/* Subtle Gradient Bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.gradient}`} />

                    <div>
                      {/* Category Title Header */}
                      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
                        <div className={`p-2 md:p-2.5 rounded-xl md:rounded-2xl bg-gradient-to-r ${cat.gradient} bg-opacity-20 text-white shadow-md shrink-0`}>
                          <Icon className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm md:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {cat.title}
                          </h3>
                        </div>
                      </div>

                      {/* Clean Skill Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {cat.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 md:px-3.5 md:py-1.5 rounded-xl bg-white/5 hover:bg-blue-600/20 text-[10px] md:text-xs font-semibold text-gray-200 hover:text-white border border-white/10 hover:border-blue-400/40 transition-all cursor-default"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Skills;