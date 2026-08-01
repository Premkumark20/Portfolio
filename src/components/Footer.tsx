import React from "react";
import { ArrowUp, Github, Linkedin, Mail, KeyRound, ShieldCheck } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

const Footer: React.FC = () => {
  const { data, isAuthenticated } = usePortfolio();

  const name = data?.name || "Portfolio";
  const title = data?.title || "";
  const githubLink = data?.github_link || "#";
  const linkedinLink = data?.linkedin_link || "#";
  const emailLink = data?.email ? `mailto:${data.email}` : "#";
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2) : "PK";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminClick = () => {
    const base = import.meta.env.BASE_URL || '/';
    const adminUrl = base.endsWith('/') ? `${base}admin` : `${base}/admin`;
    window.open(adminUrl, '_blank');
  };

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#050816]/90 backdrop-blur-xl py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-[#050816] rounded-[11px] flex items-center justify-center">
                <span className="font-extrabold text-base text-gradient">{initials}</span>
              </div>
            </div>
            <div>
              <div className="text-base font-bold text-white">{name}</div>
              <div className="text-xs text-gray-400 flex items-center gap-2">
                <span>{title}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">Open to Work</span>
              </div>
            </div>
          </div>

          {/* Social Icons & Admin Key Icon */}
          <div className="flex items-center gap-3">
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all"
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={emailLink}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>

            {/* Admin Icon Button (Opens Admin Dashboard in New Tab) */}
            <button
              onClick={handleAdminClick}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                isAuthenticated
                  ? "bg-blue-600/20 hover:bg-blue-600/40 border-blue-500/40 text-blue-400 shadow-lg shadow-blue-500/20"
                  : "bg-white/5 hover:bg-blue-500/20 border-white/10 hover:border-blue-500/30 text-gray-400 hover:text-blue-300"
              }`}
              title="Open Admin Management Panel (New Tab)"
            >
              {isAuthenticated ? (
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Back to Top Button */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
              Designed & Built with React
            </span>
            
            <button
              onClick={scrollToTop}
              className="p-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 hover:scale-110 transition-all shadow-lg"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-gray-400 flex items-center justify-center">
          <div>
            © {new Date().getFullYear()} {name}. All rights reserved. Built for recruiters, founders, & clients.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
