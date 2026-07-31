import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, ArrowUpRight, Sparkles, CheckCircle2, Clock, ShieldCheck, Cpu, Home, X, Code2, ChevronDown, ChevronUp } from "lucide-react";
import { TiltCard } from "@/components/ui/TiltCard";
import { fetchPortfolioData } from "@/lib/csvData";

interface Project {
  id: number;
  title: string;
  category: string;
  timeline: string;
  progress: number; // Percentage
  status: string;
  description: string;
  tech: string[];
  githubUrl: string;
  gradient: string;
  icon: React.ElementType;
  highlights: string[];
}

const defaultGradients = [
  "from-blue-500 to-indigo-600",
  "from-emerald-400 to-teal-600",
  "from-purple-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600",
  "from-teal-400 to-emerald-600",
];

const defaultIcons = [ShieldCheck, Cpu, Home, Code2, Sparkles];

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchPortfolioData().then((data) => {
      if (data.projects && data.projects.length > 0) {
        const mapped = data.projects.map((p, idx) => ({
          id: idx + 1,
          title: p.title,
          category: `${p.type || 'Project'} • ${p.duration || ''}`,
          timeline: p.duration || '2024 - 2025',
          progress: typeof p.progress === 'number' ? p.progress : Math.max(50, 90 - idx * 8),
          status: p.type ? `${p.type}` : 'Completed',
          description: p.description,
          tech: p.tech,
          githubUrl: p.github || 'https://github.com/Premkumark20',
          gradient: defaultGradients[idx % defaultGradients.length],
          icon: defaultIcons[idx % defaultIcons.length],
          highlights: [
            p.category || 'Software Engineering',
            `Built with ${p.tech.slice(0, 4).join(', ')}`,
          ],
        }));
        setProjectsList(mapped);
      }
    });
  }, []);

  const displayedProjects = showAll ? projectsList : projectsList.slice(0, 3);

  return (
    <section id="projects" className="py-12 sm:py-24 relative z-10">
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
            Featured Projects
          </div>
          <h2 className="text-2xl sm:text-5xl font-extrabold text-white">
            Major Software <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-xs sm:text-base">
            In-depth view of production-ready applications built using Python, FastAPI, React, Docker, and AI APIs.
          </p>
        </motion.div>

        {/* Sleek Projects Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {displayedProjects.map((project, idx) => {
            const Icon = project.icon;
            return (
              <TiltCard
                key={project.id}
                index={idx}
                flipDirection={idx === 0 ? "left" : idx === 2 ? "right" : "up"}
                interactiveTag="Project 3D Asset"
                onClick={() => setSelectedProject(project)}
              >
                <div className="glass-card glass-card-hover rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/10 flex flex-col justify-between group cursor-pointer relative overflow-hidden h-full">
                  {/* Top Accent Gradient Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${project.gradient}`} />

                  <div>
                    {/* Top Bar: Icon, Category & Progress */}
                    <div className="flex items-center justify-between mb-3.5">
                      <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r ${project.gradient} bg-opacity-20 text-white shadow-md`}>
                        <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                      </div>

                      {project.progress >= 95 ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-mono font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Completed</span>
                        </div>
                      ) : project.progress >= 75 ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] sm:text-xs font-mono font-semibold">
                          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                          <span>Almost Completed</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] sm:text-xs font-mono font-semibold">
                          <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                          <span>In Progress</span>
                        </div>
                      )}
                    </div>

                    {/* Title & Timeline */}
                    <div className="space-y-0.5 mb-2.5">
                      <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                        {project.title}
                      </h3>
                      <div className="text-xs text-blue-400 font-medium">
                        {project.category}
                      </div>
                    </div>

                    {/* Status & Completion Badge (Replaces Linear Bar) */}
                    <div className="flex items-center justify-between my-3 py-2 px-3 rounded-xl bg-white/[0.04] border border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          {project.progress >= 95 ? (
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                          ) : project.progress >= 75 ? (
                            <>
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                            </>
                          ) : (
                            <>
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
                            </>
                          )}
                        </span>
                        <span className="text-xs font-semibold font-mono text-gray-200">
                          {project.progress >= 95
                            ? "Completed"
                            : project.progress >= 75
                            ? "Almost Completed"
                            : "In Development"}
                        </span>
                      </div>
                      <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-md ${
                        project.progress >= 95
                          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                          : project.progress >= 75
                          ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                          : "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                      }`}>
                        {project.progress}% Done
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-3 mb-4">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-white/5 text-gray-300 border border-white/10"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                    >
                      <Github className="w-3.5 h-3.5 text-blue-400" />
                      <span>GitHub Code</span>
                    </a>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-white transition-colors"
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

        {/* View More / View Less Toggle Button */}
        <div className="mt-10 text-center">
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            className="px-8 py-5 rounded-2xl font-semibold text-white bg-[#111827]/80 hover:bg-[#111827] border-white/15 hover:border-blue-400/50 shadow-xl gap-2 transition-all duration-300 cursor-pointer"
          >
            <span>{showAll ? "Show Top 3 Projects" : `View All Projects`}</span>
            {showAll ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4 text-blue-400" />}
          </Button>
        </div>

      </div>

      {/* Project Detail Modal */}
      {selectedProject && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#050816]/95 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="glass-card rounded-3xl max-w-2xl w-full border border-white/15 overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 max-h-[70vh] sm:max-h-[85vh] overflow-y-auto relative bg-[#111827]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">
                  {selectedProject.category}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1 leading-snug">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white shrink-0 ml-4 transition-colors"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Status Indicator */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  {selectedProject.progress >= 95 ? (
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                  ) : selectedProject.progress >= 75 ? (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                    </>
                  ) : (
                    <>
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-400"></span>
                    </>
                  )}
                </span>
                <div>
                  <div className="text-[11px] text-gray-400 font-mono uppercase tracking-wider">Project Status</div>
                  <div className="text-sm font-bold text-white">
                    {selectedProject.progress >= 95
                      ? "Completed"
                      : selectedProject.progress >= 75
                      ? "Almost Completed"
                      : "In Development"}
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-xl text-xs font-mono font-bold ${
                selectedProject.progress >= 95
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  : selectedProject.progress >= 75
                  ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  : "bg-blue-500/10 text-blue-300 border border-blue-500/20"
              }`}>
                {selectedProject.progress}% Done
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">
              {selectedProject.description}
            </p>

            {/* Highlights */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Key Technical Features
              </h4>
              <ul className="space-y-2">
                {selectedProject.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-gray-400 uppercase">Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-4">
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all"
              >
                <Github className="w-4 h-4" />
                <span>View Source Code</span>
              </a>
              <Button
                variant="outline"
                onClick={() => setSelectedProject(null)}
                className="px-6 py-3 rounded-xl text-sm font-medium border-white/15 text-gray-300 hover:text-white"
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

export default Projects;