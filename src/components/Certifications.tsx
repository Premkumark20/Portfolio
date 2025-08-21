import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, ExternalLink, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchPortfolioData } from "@/lib/csvData";

const Certifications = () => {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPortfolioData();
      // Add default icon and color if not present
      const certsWithDefaults = data.certifications.map((cert, index) => ({
        ...cert,
        icon: index === 0 ? "🐍" : index === 1 ? "🗄️" : "🧩",
        color: index === 0 ? "bg-yellow-500" : index === 1 ? "bg-blue-500" : "bg-green-500"
      }));
      setCertifications(certsWithDefaults);
    };
    loadData();
  }, []);

  const visibleCerts = showAll ? certifications : certifications.slice(0, 3);

  return (
    <section id="certifications" className="section-container relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-primary-glow/30 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-l from-cyan-400/30 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s', animationDelay: '2s'}}></div>
      </div>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="hero-text">Certifications</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Professional certifications demonstrating my technical competencies and continuous learning
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {visibleCerts.map((cert, index) => (
          <Card key={index} className="card-hover border-0 shadow-lg relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16"></div>
            
            <CardHeader className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${cert.color} rounded-lg flex items-center justify-center text-2xl`}>
                  {cert.icon}
                </div>
                <Badge 
                  variant={cert.level === "Advanced" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {cert.level}
                </Badge>
              </div>
              
              <CardTitle className="text-xl mb-2">{cert.title}</CardTitle>
              <p className="text-primary font-medium">{cert.provider}</p>
            </CardHeader>
            
            <CardContent className="relative">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{cert.date}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="font-mono text-xs">{cert.certificateId}</span>
                </div>
              </div>
              
              <Button size="sm" asChild className="w-full cursor-pointer">
                <a href={cert.link} target="_blank" rel="noopener noreferrer" onClick={(e) => {
                  if (!cert.link || cert.link.trim() === '' || cert.link === '#') {
                    e.preventDefault();
                  }
                }}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Certificate
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {certifications.length > 3 && (
        <div className="mt-8 text-center">
          <Button variant="outline" className="cursor-pointer" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'View Less' : 'View More'}
          </Button>
        </div>
      )}
    </section>
  );
};

export default Certifications;