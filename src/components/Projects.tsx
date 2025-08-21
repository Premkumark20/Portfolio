import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink, Calendar, Users, User } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchPortfolioData } from "@/lib/csvData";

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPortfolioData();
      // Add default icon and gradient if not present
      const projectsWithDefaults = data.projects.map((project, index) => ({
        ...project,
        icon: index === 2 ? User : Users, // SmartBank is User, others are Users
        gradient: index === 0 ? "from-blue-500 to-cyan-500" : 
                  index === 1 ? "from-purple-500 to-pink-500" : 
                  "from-green-500 to-emerald-500"
      }));
      setProjects(projectsWithDefaults);
    };
    loadData();
  }, []);

  const visibleProjects = showAll ? projects : projects.slice(0, 3);

  return (
    <section id="projects" className="section-container relative overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '5s'}}></div>
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-gradient-to-l from-primary-glow/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '7s', animationDelay: '1s'}}></div>
      </div>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Featured <span className="hero-text">Projects</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A showcase of my technical projects demonstrating web development, 
          database management, and problem-solving skills
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 relative z-10">
        {visibleProjects.map((project, index) => (
          <Card 
            key={index} 
            className="card-hover border border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg h-full flex flex-col group relative overflow-hidden"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary-glow/20 to-cyan-400/20 rounded-lg opacity-0 group-hover:opacity-100 blur transition-opacity duration-500"></div>
            
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${project.gradient} rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                  <project.icon className="w-6 h-6 text-white" />
                </div>
                <Badge variant="outline" className="text-xs border-primary/30 group-hover:border-primary transition-colors duration-300">
                  {project.type}
                </Badge>
              </div>
              <CardTitle className="text-xl mb-3 group-hover:text-primary-glow transition-colors duration-300">{project.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="w-4 h-4 group-hover:text-primary-glow transition-colors duration-300" />
                <span>{project.duration}</span>
              </div>
              <Badge variant="secondary" className="w-fit text-xs bg-primary/10 text-primary-glow border border-primary/20">
                {project.category}
              </Badge>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col relative z-10">
              <p className="text-muted-foreground mb-6 leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                {project.description}
              </p>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3 group-hover:text-primary-glow transition-colors duration-300">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <Badge 
                      key={techIndex} 
                      variant="outline" 
                      className="text-xs border-primary/20 hover:border-primary hover:bg-primary/10 transition-all duration-300"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 mt-auto">
                {project.github && project.github.trim() && project.github !== '#' && (
                  <Button 
                    asChild
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-cyan-400 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/25"
                  >
                    <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => {
                      if (!project.github || project.github.trim() === '' || project.github === '#') {
                        e.preventDefault();
                      }
                    }}>
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {project.live && project.live.trim() && project.live !== '#' && (
                  <Button 
                    asChild
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-primary/50 hover:border-primary text-primary-glow hover:bg-primary/10 transition-all duration-300"
                  >
                    <a href={project.live} target="_blank" rel="noopener noreferrer" onClick={(e) => {
                      if (!project.live || project.live.trim() === '' || project.live === '#') {
                        e.preventDefault();
                      }
                    }}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length > 3 && (
        <div className="mt-8 text-center">
          <Button variant="outline" className="cursor-pointer" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'View Less' : 'View More'}
          </Button>
        </div>
      )}
    </section>
  );
};

export default Projects;