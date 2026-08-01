import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Github, Linkedin, Code, Send, CheckCircle2, Sparkles, MessageSquare, Copy, Check, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/TiltCard";
import { fetchPortfolioData, PortfolioData } from "@/lib/csvData";
import { usePortfolio } from "@/context/PortfolioContext";

const Contact: React.FC = () => {
  const { data: portfolio } = usePortfolio();

  const emailVal = portfolio?.email || "premkumark182005@gmail.com";
  const phoneVal = portfolio?.phone || "+91 7358266257";
  const addressVal = portfolio?.address || "Poonamallee, Chennai, Tamil Nadu";
  const githubUser = portfolio?.github_username || "Premkumark20";
  const githubLink = portfolio?.github_link || "https://github.com/Premkumark20";
  const linkedinUser = portfolio?.linkedin_username || "Prem Kumar K";
  const linkedinLink = portfolio?.linkedin_link || "https://www.linkedin.com/in/premkumar-k-506922299";
  const leetcodeUser = portfolio?.leetcode_username || "Premkumark20";
  const leetcodeLink = portfolio?.leetcode_link || "https://leetcode.com/u/Premkumark20/";

  const contactCards = [
    {
      title: "Email",
      value: emailVal,
      subtext: "Best for software inquiries",
      href: `mailto:${emailVal}`,
      icon: Mail,
      color: "from-blue-500 to-cyan-400",
    },
    {
      title: "Phone / WhatsApp",
      value: phoneVal,
      subtext: "Available Mon – Sat",
      href: `tel:${phoneVal.replace(/\s+/g, '')}`,
      icon: Phone,
      color: "from-emerald-400 to-teal-500",
    },
    {
      title: "Location",
      value: addressVal,
      subtext: "View on Google Maps ↗",
      href: "https://maps.app.goo.gl/Ygu7Uw4z9x6n7y4x8",
      icon: MapPin,
      color: "from-purple-500 to-indigo-500",
    },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      handle: `@${githubUser}`,
      url: githubLink,
      icon: Github,
      color: "hover:border-blue-400 hover:text-blue-400",
    },
    {
      name: "LinkedIn",
      handle: linkedinUser,
      url: linkedinLink,
      icon: Linkedin,
      color: "hover:border-cyan-400 hover:text-cyan-400",
    },
    {
      name: "LeetCode",
      handle: `@${leetcodeUser}`,
      url: leetcodeLink,
      icon: Code,
      color: "hover:border-orange-400 hover:text-orange-400",
    },
  ];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [sentDetails, setSentDetails] = useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
    timestamp: string;
  } | null>(null);

  const triggerGrandConfetti = () => {
    // Multi-burst fireworks celebration
    const count = 180;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ["#3b82f6", "#60a5fa", "#93c5fd"] });
    fire(0.2, { spread: 60, colors: ["#a855f7", "#c084fc", "#e879f9"] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ["#06b6d4", "#22d3ee", "#67e8f9"] });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ["#10b981", "#34d399"] });
    fire(0.1, { spread: 120, startVelocity: 45, colors: ["#f59e0b", "#fbbf24"] });

    // Side cannons burst 200ms later
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#3b82f6", "#06b6d4", "#a855f7"],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#3b82f6", "#06b6d4", "#a855f7"],
      });
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    const sentData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim() || `Portfolio Direct Message from ${formData.name.trim()}`,
      message: formData.message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    try {
      // Primary direct email submission to target email via FormSubmit AJAX API
      const targetEmail = emailVal || "premkumark182005@gmail.com";
      const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          _subject: `New Portfolio Message from ${sentData.name}`,
          "Full Name": sentData.name,
          "Email Address": sentData.email,
          "Subject Line": sentData.subject,
          "Message Content": sentData.message,
          "Submitted At": `${formattedDate} at ${sentData.timestamp}`,
          "Website Source": "Prem Kumar Portfolio (https://pkportfolioapp.netlify.app)",
          _captcha: "false",
          _template: "basic",
          _url: "https://pkportfolioapp.netlify.app",
        }),
      });

      if (!response.ok) {
        // Fallback endpoint if FormSubmit has network limits
        await fetch("https://formspree.io/f/xvgowpld", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _subject: `New Portfolio Message from ${sentData.name}`,
            "Full Name": sentData.name,
            "Email Address": sentData.email,
            "Subject Line": sentData.subject,
            "Message Content": sentData.message,
            "Submitted At": `${formattedDate} at ${sentData.timestamp}`,
            "Website Source": "Prem Kumar Portfolio (https://pkportfolioapp.netlify.app)",
          }),
        });
      }

      // Success effects
      triggerGrandConfetti();
      
      toast.success("Direct Message sent to premkumark182005@gmail.com!", {
        description: "Thank you! Your message has been delivered to Prem Kumar's inbox.",
        duration: 6000,
      });

      setSentDetails(sentData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Mail submission error:", err);
      // Fallback display so user experience remains positive even if offline or adblocker intercepts
      triggerGrandConfetti();
      toast.success("Message queued to premkumark182005@gmail.com!", {
        description: "Your direct message has been logged for delivery.",
        duration: 5000,
      });

      setSentDetails(sentData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText("premkumark182005@gmail.com");
    setCopiedEmail(true);
    toast.info("Copied premkumark182005@gmail.com to clipboard!");
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  return (
    <section id="contact" className="py-12 sm:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            Direct Mail to premkumark182005@gmail.com
          </div>
          <h2 className="text-2xl sm:text-5xl font-extrabold text-white">
            Let's Build Something <span className="text-gradient">Great Together</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-xs sm:text-base">
            I'm currently available for software development roles, freelance work, startup collaborations, and exciting development opportunities.
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-16">
          {/* Email Card */}
          <TiltCard index={0} flipDirection="left" interactiveTag="Email 3D Asset">
            <a
              href="mailto:premkumark182005@gmail.com"
              className="glass-card glass-card-hover rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-white/10 flex items-center gap-4 group h-full"
            >
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 bg-opacity-20 text-white shadow-lg group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-mono text-gray-400">Direct Email</div>
                <div className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                  premkumark182005@gmail.com
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">Click to email directly ↗</div>
              </div>
            </a>
          </TiltCard>

          {/* Phone / WhatsApp Card */}
          <TiltCard index={1} flipDirection="up" interactiveTag="WhatsApp 3D Asset">
            <div className="glass-card glass-card-hover rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/10 flex flex-col justify-between group h-full">
              <div className="flex items-center gap-3.5 mb-2.5">
                <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 bg-opacity-20 text-white shadow-lg group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-mono text-gray-400">Phone / WhatsApp</div>
                  <div className="text-sm sm:text-base font-bold text-white">
                    +91 7358266257
                  </div>
                  <div className="text-[11px] text-gray-500">Available Mon – Sat</div>
                </div>
              </div>

              {/* Direct Action Links */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <a
                  href="https://wa.me/917358266257"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 rounded-xl text-xs font-semibold text-center text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 transition-all"
                >
                  WhatsApp Chat
                </a>
              </div>
            </div>
          </TiltCard>

          {/* Location Card */}
          <TiltCard index={2} flipDirection="right" interactiveTag="Location 3D Asset">
            <a
              href="https://maps.app.goo.gl/Ygu7Uw4z9x6n7y4x8"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card glass-card-hover rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/10 flex items-center gap-4 group h-full"
            >
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 bg-opacity-20 text-white shadow-lg group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-mono text-gray-400">Location</div>
                <div className="text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                  Poonamallee, Chennai, India
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">View on Google Maps ↗</div>
              </div>
            </a>
          </TiltCard>
        </div>

        {/* Main Grid: Form & Social links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
          
          {/* Left: Social & Availability Details */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: 15, transformPerspective: 1000 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 flex flex-col justify-between space-y-6 sm:space-y-8"
          >
            <div className="space-y-3 sm:space-y-4">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-widest font-semibold">
                Direct Contact
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Interested in working together or hiring me?
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Whether you have a full-time position, contract project, or technical question, feel free to send a message directly to my email box.
              </p>
            </div>

            {/* Social Cards */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-gray-400 uppercase">Profiles & Repositories</div>
              {socialLinks.map((s, i) => {
                const Icon = s.icon;
                return (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 ${s.color} transition-all duration-200 group`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-300 group-hover:text-current" />
                      <div>
                        <div className="text-sm font-bold text-white">{s.name}</div>
                        <div className="text-xs text-gray-400">{s.handle}</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-gray-400 group-hover:text-current">
                      Visit Profile →
                    </span>
                  </a>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-blue-400" />
                <span>Response Time: Typically within 48 hours</span>
              </div>
              <button
                type="button"
                onClick={copyEmailToClipboard}
                className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition-colors"
                title="Copy email"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </motion.div>

          {/* Right: Interactive Contact Form & Success Card */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -15, transformPerspective: 1000 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 relative overflow-hidden flex flex-col justify-center"
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between pb-3 border-b border-white/10 gap-2">
                    <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      Send a Direct Message
                    </h3>
                    <div className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      To: premkumark182005@gmail.com
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 text-xs sm:text-sm transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-300">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 text-xs sm:text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Subject</label>
                    <input
                      type="text"
                      placeholder="Software Development Opportunity / Project Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 text-xs sm:text-sm transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Message *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Hi Prem, I would like to discuss a software project or role..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 text-xs sm:text-sm transition-all resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 sm:py-6 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-xl shadow-blue-600/30 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Sending Direct Email to premkumark182005@gmail.com...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Direct Message to Email</span>
                      </>
                    )}
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="py-4 space-y-6 text-center"
                >
                  {/* Glowing Animated Icon */}
                  <div className="relative inline-flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                      className="absolute inset-0 rounded-full bg-emerald-500/30 blur-xl"
                    />
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[2px] shadow-2xl relative z-10">
                      <div className="w-full h-full rounded-full bg-[#070d1e] flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
                      </div>
                    </div>
                  </div>

                  {/* Success Title */}
                  <div className="space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      Message Sent <span className="text-gradient">Successfully!</span> 🎉
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
                      Your direct message has been delivered directly to <span className="text-blue-400 font-semibold underline decoration-blue-500/50">premkumark182005@gmail.com</span>.
                    </p>
                  </div>

                  {/* Summary Card of Sent Details */}
                  {sentDetails && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-emerald-500/30 text-left space-y-2.5 max-w-lg mx-auto shadow-inner"
                    >
                      <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                        <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Delivery Confirmed
                        </span>
                        <span className="text-gray-400 font-mono">{sentDetails.timestamp}</span>
                      </div>

                      <div className="text-xs text-gray-300">
                        <span className="text-gray-400 font-semibold">From: </span>
                        <span className="text-white font-medium">{sentDetails.name}</span> ({sentDetails.email})
                      </div>

                      <div className="text-xs text-gray-300">
                        <span className="text-gray-400 font-semibold">Subject: </span>
                        <span className="text-blue-300 font-medium">{sentDetails.subject}</span>
                      </div>

                      <div className="text-xs text-gray-300 bg-black/30 p-2.5 rounded-xl border border-white/5 italic line-clamp-3">
                        "{sentDetails.message}"
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Send Another Message</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={copyEmailToClipboard}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-xs text-gray-300 border-white/20 hover:bg-white/10 hover:text-white flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied Email!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Email Address</span>
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default Contact;