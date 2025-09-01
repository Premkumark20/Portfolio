import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Github, Linkedin, Code } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchPortfolioData } from "@/lib/csvData";

const Contact = () => {
  const [portfolioData, setPortfolioData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPortfolioData();
      setPortfolioData(data);
    };
    loadData();
  }, []);

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: portfolioData?.email || "premkumark182005@gmail.com",
      href: portfolioData?.email ? `mailto:${portfolioData.email}` : "mailto:premkumark182005@gmail.com",
      color: "text-blue-500"
    },
    {
      icon: Phone,
      label: "Phone",
      value: portfolioData?.phone || "+91 7358266257",
      href: portfolioData?.phone ? `tel:${portfolioData.phone}` : "tel:+917358266257",
      color: "text-green-500"
    },
    {
      icon: MapPin,
      label: "Location",
      value: portfolioData?.address || "Chennai, Tamil Nadu",
      href: "https://www.google.com/maps/search/?api=1&query=Chennai%2C%20Tamil%20Nadu",
      color: "text-red-500"
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      value: portfolioData?.github_link || "https://github.com/premkumark20",
      href: portfolioData?.github_link || "https://github.com/premkumark20",
      color: "text-gray-700"
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: portfolioData?.linkedin_link || "https://www.linkedin.com/in/premkumar-k-506922299/",
      href: portfolioData?.linkedin_link || "https://www.linkedin.com/in/premkumar-k-506922299/",
      color: "text-blue-600"
    },
    {
      icon: Code,
      label: "LeetCode",
      value: portfolioData?.leetcode_link || "https://leetcode.com/u/premkumark20/",
      href: portfolioData?.leetcode_link || "https://leetcode.com/u/premkumark20/",
      color: "text-orange-500"
    }
  ];

  const emailHref = contactInfo.find(c => c.label === 'Email')?.href;
  const phoneHref = contactInfo.find(c => c.label === 'Phone')?.href;

  return (
    <section id="contact" className="section-container dynamic-bg relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
      {/* Animated Contact Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-gradient-to-l from-cyan-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '3s'}}></div>
      </div>
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
          Get In <span className="hero-text">Touch</span>
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
          I'm always open to discussing new opportunities, interesting projects, 
          or just having a conversation about technology and innovation.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Contact Information */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Contact Information</h3>
              <div className="space-y-4 sm:space-y-6">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <contact.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${contact.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm sm:text-base">{contact.label}</p>
                      {/* make values clickable */}
                      {(() => {
                        const isLocation = contact.label === 'Location';
                        const href = contact.href;
                        const target = isLocation ? '_blank' : undefined;
                        const rel = isLocation ? 'noopener noreferrer' : undefined;
                        return (
                          <a
                            href={href}
                            target={target as any}
                            rel={rel as any}
                            className="text-muted-foreground hover:text-primary-glow underline-offset-4 hover:underline cursor-pointer text-sm sm:text-base break-words"
                          >
                            {contact.value}
                          </a>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Social Links & Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Connect With Me</h3>
              
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {socialLinks.map((social, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-accent/20 hover:bg-accent/40 transition-colors">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <social.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${social.color} flex-shrink-0`} />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base">{social.label}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{social.value}</p>
                      </div>
                    </div>
                    {social.href && social.href.trim() && social.href !== '#' && (
                      <Button variant="ghost" size="sm" asChild className="cursor-pointer flex-shrink-0 ml-2">
                        <a href={social.href} target="_blank" rel="noopener noreferrer" onClick={(e) => {
                          if (!social.href || social.href.trim() === '' || social.href === '#') {
                            e.preventDefault();
                          }
                        }}>
                          Visit
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <Button className="w-full cursor-pointer text-sm sm:text-base" size="lg" asChild>
                  <a href={emailHref}> 
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Send Email
                  </a>
                </Button>
                <Button variant="outline" className="w-full cursor-pointer text-sm sm:text-base" size="lg" asChild>
                  <a href={phoneHref}>
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Call Now
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Message */}
        <div className="mt-12 sm:mt-16 text-center">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-blue-500/5">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Let's Build Something Amazing Together</h3>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto text-sm sm:text-base px-4">
                Whether you're looking for a passionate developer for your team, need help with a project, 
                or want to collaborate on innovative solutions, I'd love to hear from you. 
                Let's turn ideas into reality!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;