import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Education", href: "#education" },
    { name: "Projects", href: "#projects" },
    
    { name: "Skills", href: "#skills" },
    { name: "Certifications", href: "#certifications" },
    { name: "Contact", href: "#contact" }
  ];

  useEffect(() => {
    const handlePopState = () => {
      // Always go to home section when back button is pressed
      const homeElement = document.querySelector('#home');
      if (homeElement) {
        homeElement.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-primary/30 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-26">
          {/* Enhanced Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center shadow-lg">
              <span className="text-xs md:text-sm font-bold text-background">PK</span>
            </div>
            <span className="text-base md:text-lg font-bold text-shimmer hidden sm:block">PREM KUMAR</span>
          </div>

          {/* Enhanced Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4 lg:space-x-6">
              {menuItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary-glow transition-all duration-300 relative group font-medium px-2 py-1 rounded-lg hover:bg-primary/10 text-sm"
                  style={{animationDelay: `${index * 0.1}s`}}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(item.href);
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {item.name}
                  <span className="absolute -bottom-0.5 left-2 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow transition-all duration-300 group-hover:w-[calc(100%-1rem)]"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-primary/20 h-8 w-8"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary/10">
            <div className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary-glow transition-colors duration-300 py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(item.href);
                    element?.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;