import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, MapPin, Building2 } from "lucide-react";
import { useState } from "react";
import { usePortfolio } from "@/context/PortfolioContext";

const gradients = [
  "from-blue-600 to-indigo-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-purple-600 to-pink-600",
  "from-amber-500 to-orange-600",
];

const Experience = () => {
  const { data } = usePortfolio();
  const experiences = data?.experiences || [];

  const [showAll, setShowAll] = useState(false);
  const visibleExperiences = showAll ? experiences : experiences.slice(0, 3);

  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden z-10">
      {/* Background Glows */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s" }}></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-l from-cyan-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: "8s", animationDelay: "1s" }}></div>
      </div>

      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Career Milestone
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white">
          Work <span className="text-gradient">Experience</span>
        </h2>
        <p className="text-base text-gray-400 max-w-2xl mx-auto">
          Roles and responsibilities that shaped my engineering skills.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {visibleExperiences.map((exp, index) => {
          const grad = exp.gradient || gradients[index % gradients.length];
          return (
            <Card
              key={`${exp.role}-${index}`}
              className="card-hover border border-white/10 bg-[#070a1d]/80 backdrop-blur-md shadow-xl relative overflow-hidden group hover:border-blue-500/30 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${grad} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 font-semibold">
                    {exp.company}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-white font-bold mb-2">{exp.role}</CardTitle>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                  <span className="inline-flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-blue-400" /> {exp.company}</span>
                  {exp.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-400" /> {exp.location}</span>}
                  {exp.duration && <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-400" /> {exp.duration}</span>}
                </div>
              </CardHeader>

              <CardContent className="relative z-10">
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{exp.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {(exp.tags || []).map((t, i) => (
                    <Badge key={i} variant="outline" className="text-xs border-white/15 text-gray-300 bg-white/5 hover:border-blue-400 hover:bg-blue-500/10 transition-colors">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {experiences.length > 3 && (
        <div className="mt-10 text-center">
          <Button variant="outline" className="cursor-pointer border-white/15 bg-white/5 hover:bg-white/10 text-white" onClick={() => setShowAll(!showAll)}>
            {showAll ? "View Less" : "View More Experiences"}
          </Button>
        </div>
      )}
    </section>
  );
};

export default Experience;