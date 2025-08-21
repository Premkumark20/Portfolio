import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Globe, Wrench, Brain, Languages } from "lucide-react";

const Skills = () => {
  const skillCategories = [
    {
      title: "Programming Languages",
      icon: Code,
      skills: ["Python", "Java (Basic)", "JavaScript (Basic)"],
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      title: "Frameworks & Libraries",
      icon: Globe,
      skills: ["Python Flask", "Matplotlib"],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "Databases & Tools",
      icon: Database,
      skills: ["MySQL", "SQLite3", "CSV", "API Integration", "GitHub"],
      gradient: "from-purple-500 to-violet-500"
    },
    {
      title: "Web Technologies",
      icon: Wrench,
      skills: ["HTML", "CSS", "Web Hosting", "PythonAnywhere", "Render", "Netlify"],
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: "Technical Skills",
      icon: Brain,
      skills: ["Backend Development", "Database Management", "Web Application Deployment", "Data Visualization"],
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      title: "Languages",
      icon: Languages,
      skills: ["Tamil (Native)", "English (Working)", "German (Elementary)"],
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  const interests = [
    "Full-Stack Web Development",
    "Data-Driven Applications", 
    "API Development & Integration",
    "Cloud Computing",
    "Database Systems"
  ];

  return (
    <section id="skills" className="section-container dynamic-bg relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{
               backgroundImage: `radial-gradient(circle at 1px 1px, hsl(267 84% 65% / 0.3) 1px, transparent 0)`,
               backgroundSize: '50px 50px',
               animation: 'float 8s ease-in-out infinite'
             }}>
        </div>
      </div>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Skills & <span className="hero-text">Expertise</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Technical skills and technologies I work with to build innovative solutions
        </p>
      </div>

      {/* Enhanced Skills Grid with Dynamic Effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 relative z-10">
        {skillCategories.map((category, index) => (
          <Card 
            key={index} 
            className="card-hover border border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg h-full group relative overflow-hidden"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary-glow/10 to-cyan-400/10 rounded-lg opacity-0 group-hover:opacity-100 blur transition-opacity duration-500"></div>
            
            <CardHeader className="relative z-10">
              <div className={`w-12 h-12 bg-gradient-to-r ${category.gradient} rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg group-hover:text-primary-glow transition-colors duration-300">{category.title}</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <Badge 
                    key={skillIndex} 
                    variant="secondary" 
                    className="text-xs bg-primary/10 text-primary-glow border border-primary/20 hover:bg-primary/20 hover:scale-105 transition-all duration-300"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Areas of Interest */}
      <Card className="border border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-2xl text-center mb-4 group-hover:text-primary-glow transition-colors duration-300">
            Areas of <span className="hero-text">Interest</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex flex-wrap justify-center gap-3">
            {interests.map((interest, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="px-4 py-2 text-sm border-primary/30 hover:border-primary hover:bg-primary/10 hover:text-primary-glow hover:scale-105 transition-all duration-300"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {interest}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Skills;