import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchPortfolioData } from "@/lib/csvData";
import profileImage from "@/assets/profile.jpg";

const Hero = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  const [portfolioData, setPortfolioData] = useState<any>(null);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6
    }));
    setParticles(newParticles);

    const loadData = async () => {
      const data = await fetchPortfolioData();
      setPortfolioData(data);
    };
    loadData();
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center dynamic-bg relative overflow-hidden pt-12 md:pt-14">
      {/* Floating Particles */}
      <div className="floating-particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle w-2 h-2"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Geometric Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-primary/30 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 border border-primary-glow/40 rounded-lg animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 border border-cyan-400/20 rounded-full animate-pulse" style={{animationDuration: '4s'}}></div>
      </div>

      <div className="section-container z-10">
        <div className="flex flex-col md:flex-row lg:flex-row items-center gap-8 md:gap-28">
          {/* Profile Image - Left Side on desktop, top on mobile */}
          <div className="flex-shrink-0 order-1 md:order-1">
            <div className="relative">
              <div className="gradient-border rounded-full">
                <img 
                  src={profileImage}
                  alt="Prem Kumar K - Professional Portrait"
                  className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full object-cover object-[center_40%] relative z-10 border-4 border-primary/20"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 sm:border-3 border-background animate-pulse shadow-lg"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary-glow/20 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Content - Right Side on desktop, bottom on mobile */}
          <div className="flex-1 text-center md:text-left order-2 md:order-2 md:ml-8">
            {/* Enhanced Hero Text with Shimmer Effect */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-shimmer">{portfolioData?.name || "PREM KUMAR K"}</span>
            </h1>
            
            <div className="space-y-4 mb-8">
              <p className="text-lg sm:text-xl md:text-2xl text-primary-glow mb-4 font-medium animate-pulse">
                {portfolioData?.title || "Computer Science & Engineering Student"}
              </p>
              
              <div className="relative inline-block">
                <p className="text-base sm:text-lg text-muted-foreground mb-2 bg-card/50 backdrop-blur-sm px-4 sm:px-6 py-2 rounded-full border border-primary/20">
                  {portfolioData?.specialization || "Specializing in Cloud Computing"}
                </p>
              </div>
              
              <p className="text-sm sm:text-base text-muted-foreground/80">
                {portfolioData?.education || "SRM Institute of Science and Technology, Ramapuram | Class of 2027"}
              </p>
            </div>

            {/* Animated Contact Info */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 mb-8 sm:mb-10 text-xs sm:text-sm">
              {[
                { icon: Mail, text: portfolioData?.email || "pk1844@srmist.edu.in" },
                { icon: Phone, text: portfolioData?.phone || "+91 7358266257" },
                { icon: MapPin, text: portfolioData?.address || "Chennai, Tamil Nadu" }
              ].map((contact, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-card/30 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:bg-card/50"
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <contact.icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary-glow" />
                  <span className="text-muted-foreground">{contact.text}</span>
                </div>
              ))}
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8 sm:mb-10">
              <Button
                asChild
                size="lg"
                className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-cyan-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25"
              >
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.getElementById('projects');
                    if (target) {
                      const headerOffset = 64; // 4rem header height
                      const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                >
                  View My Projects
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg border-primary/50 hover:border-primary text-primary-glow hover:bg-primary/10 transform hover:scale-105 transition-all duration-300"
              >
                <a 
                  href="/Portfolio/resume/Prem%20kumar%20Resume.pdf" 
                  download="Prem_Kumar_Resume.pdf"
                  type="application/pdf"
                >
                  Download Resume
                </a>
              </Button>
            </div>

            {/* Enhanced Social Links */}
            <div className="flex justify-center md:justify-start gap-4 sm:gap-6">
              {[
                { icon: Github, href: portfolioData?.github_link || "https://github.com/your-username", delay: "0s" },
                { icon: Linkedin, href: portfolioData?.linkedin_link || "https://www.linkedin.com/in/your-username", delay: "0.1s" }
              ].map((social, index) => (
                <Button 
                  key={index}
                  asChild
                  variant="ghost" 
                  size="icon" 
                  className="w-10 h-10 sm:w-12 sm:h-12 hover:bg-primary/20 hover:text-primary-glow transition-all duration-300 hover:scale-110 border border-primary/20 hover:border-primary/50"
                  style={{animationDelay: social.delay}}
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;