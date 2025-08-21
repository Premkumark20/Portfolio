import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Calendar } from "lucide-react";

const Education = () => {
  const education = [
    {
      degree: "B.Tech in Computer Science and Engineering",
      specialization: "Cloud Computing",
      institution: "SRM Institute of Science and Technology, Ramapuram",
      location: "Chennai, Tamil Nadu",
      year: "2023 - 2027",
      grade: "CGPA: 8.44/10",
      status: "Pursuing",
      color: "bg-primary"
    },
    {
      degree: "Class XII - State Board",
      specialization: "Mathematics with Computer Science",
      institution: "St. Joseph Matric Hr Sec School",
      location: "Poonamallee, Chennai",
      year: "2023",
      grade: "Percentage: 71%",
      status: "Completed",
      color: "bg-blue-500"
    },
    {
      degree: "Class X - State Board",
      specialization: "",
      institution: "St. Joseph Matric Hr Sec School",
      location: "Poonamallee, Chennai", 
      year: "2021",
      grade: "Percentage: 88.4%",
      status: "Completed",
      color: "bg-green-500"
    }
  ];

  return (
    <section id="education" className="section-container bg-gradient-to-b from-background to-accent/20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="hero-text">Education</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          My academic journey and achievements in Computer Science and Engineering
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {education.map((edu, index) => (
          <div key={index} className="relative mb-8 last:mb-0">
            {/* Timeline line */}
            {index !== education.length - 1 && (
              <div className="absolute left-8 top-20 w-0.5 h-full bg-border"></div>
            )}
            
            <Card className="card-hover ml-16 border-0 shadow-lg">
              <CardContent className="p-8">
                {/* Timeline dot */}
                <div className={`absolute -left-8 top-8 w-4 h-4 ${edu.color} rounded-full border-4 border-background`}></div>
                
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      <Badge variant="outline" className="text-xs">
                        {edu.status}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {edu.degree}
                    </h3>
                    {edu.specialization && (
                      <p className="text-primary font-medium mb-2">
                        {edu.specialization}
                      </p>
                    )}
                    <p className="text-muted-foreground mb-1">
                      {edu.institution}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {edu.location}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2 lg:justify-end">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{edu.year}</span>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {edu.grade}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;