import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Award, Code } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchPortfolioData } from "@/lib/csvData";

const About = () => {
  const [portfolioData, setPortfolioData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPortfolioData();
      setPortfolioData(data);
    };
    loadData();
  }, []);

  const stats = [
    { icon: GraduationCap, label: "CGPA", value: portfolioData?.cgpa || "8.44/10" },
    { icon: Code, label: "Projects", value: "3+" },
    { icon: Award, label: "Certifications", value: "3+" },
  ];

  return (
    <section id="about" className="section-container relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/30 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-l from-primary-glow/30 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
      </div>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          About <span className="hero-text">Me</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          I'm a passionate Computer Science student specializing in Cloud Computing, 
          with a strong foundation in web development and database systems. I love building 
          innovative solutions that solve real-world problems.
        </p>
      </div>

      {/* Enhanced Stats Cards with Dynamic Effects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="card-hover border border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg relative overflow-hidden group"
            style={{animationDelay: `${index * 0.2}s`}}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="p-8 text-center relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-110">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-primary-glow mb-2 group-hover:text-cyan-400 transition-colors duration-300">{stat.value}</div>
              <div className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* About Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h3 className="text-2xl font-bold mb-6">My Journey</h3>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Currently pursuing my B.Tech in Computer Science and Engineering with a 
              specialization in Cloud Computing at SRM Institute of Science and Technology, 
              Ramapuram. I maintain a strong academic record with a CGPA of 8.44/10.
            </p>
            <p>
              My passion lies in full-stack web development, particularly in creating 
              data-driven applications using Python Flask, MySQL, and modern web technologies. 
              I enjoy working on projects that combine technical excellence with practical utility.
            </p>
            <p>
              Beyond academics, I'm constantly learning and improving my skills through 
              certifications and hands-on projects. I believe in the power of technology 
              to create positive change in the world.
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold mb-6">What I Do</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold mb-2">Web Development</h4>
                <p className="text-muted-foreground">
                  Building responsive web applications using Python Flask, HTML, CSS, and JavaScript
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold mb-2">Database Management</h4>
                <p className="text-muted-foreground">
                  Designing and implementing database systems using MySQL and SQLite
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
              <div>
                <h4 className="font-semibold mb-2">Cloud Computing</h4>
                <p className="text-muted-foreground">
                  Learning and implementing cloud-based solutions and deployment strategies
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;