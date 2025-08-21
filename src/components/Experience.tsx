import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, MapPin, Building2 } from "lucide-react";
import { useState } from "react";

const Experience = () => {
  const experiences = [
    {
      role: "Frontend Developer Intern",
      company: "TechNova Labs",
      location: "Chennai, Tamil Nadu",
      duration: "Jan 2025 - Apr 2025",
      summary:
        "Built responsive UI components with React and Tailwind, improved page performance and accessibility.",
      tags: ["React", "TypeScript", "TailwindCSS", "Vite"],
      gradient: "from-primary to-primary-glow",
    },
    {
      role: "Web Developer Trainee",
      company: "DevWorks Studio",
      location: "Remote",
      duration: "Aug 2024 - Dec 2024",
      summary:
        "Developed internal dashboards and collaborated on design systems, focusing on reusability and DX.",
      tags: ["Design System", "Shadcn", "Radix", "DX"],
      gradient: "from-cyan-400 to-blue-500",
    },
    {
      role: "Student Project Lead",
      company: "SRM Institute",
      location: "Chennai, Tamil Nadu",
      duration: "Jan 2024 - Jul 2024",
      summary:
        "Led a small team to ship a data-driven app; owned planning, code reviews, and deployment.",
      tags: ["Leadership", "Git", "CI/CD"],
      gradient: "from-emerald-500 to-green-600",
    },
  ];

  const [showAll, setShowAll] = useState(false);
  const visibleExperiences = showAll ? experiences : experiences.slice(0, 3);

  return (
    <section id="experience" className="section-container relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s" }}></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-l from-cyan-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: "8s", animationDelay: "1s" }}></div>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Work <span className="hero-text">Experience</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Roles and responsibilities that shaped my engineering skills.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {visibleExperiences.map((exp, index) => (
          <Card
            key={`${exp.role}-${index}`}
            className="card-hover border border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg relative overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary-glow/20 to-cyan-400/20 rounded-lg opacity-0 group-hover:opacity-100 blur transition-opacity duration-500"></div>

            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${exp.gradient} rounded-lg flex items-center justify-center shadow-lg`}>
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary-glow border border-primary/20">
                  {exp.company}
                </Badge>
              </div>
              <CardTitle className="text-xl mb-2">{exp.role}</CardTitle>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Building2 className="w-4 h-4" /> {exp.company}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" /> {exp.location}</span>
                <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" /> {exp.duration}</span>
              </div>
            </CardHeader>

            <CardContent className="relative z-10">
              <p className="text-muted-foreground mb-4 leading-relaxed">{exp.summary}</p>
              <div className="flex flex-wrap gap-2">
                {exp.tags.map((t, i) => (
                  <Badge key={i} variant="outline" className="text-xs border-primary/20 hover:border-primary hover:bg-primary/10 transition-colors">
                    {t}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {experiences.length > 3 && (
        <div className="mt-8 text-center">
          <Button variant="outline" className="cursor-pointer" onClick={() => setShowAll(!showAll)}>
            {showAll ? "View Less" : "View More"}
          </Button>
        </div>
      )}
    </section>
  );
};

export default Experience; 