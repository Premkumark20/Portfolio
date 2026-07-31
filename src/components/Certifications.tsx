import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Calendar, Eye, X, ExternalLink, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/TiltCard";
import { fetchPortfolioData } from "@/lib/csvData";
import { getAssetUrl } from "@/lib/utils";

interface Certification {
  id: number;
  title: string;
  platform: string;
  issueDate: string;
  category: string;
  pdfPath: string;
}

// Client-side PDF previewer using PDF.js to avoid mobile iframe download prompts
const PdfCanvasViewer: React.FC<{ url: string }> = ({ url }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const renderPdf = async () => {
      try {
        if (!(window as any).pdfjsLib) {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
          script.async = true;
          document.body.appendChild(script);
          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }
        
        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        if (!active) return;

        const page = await pdf.getPage(1);
        if (!active) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const viewport = page.getViewport({ scale: 1.0 });
        
        // Responsive scaling to fit container width
        const containerWidth = canvas.parentElement?.clientWidth || 400;
        const scale = containerWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale: Math.min(scale, 1.8) });

        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;

        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
        };

        await page.render(renderContext).promise;
        if (active) {
          setLoading(false);
        }
      } catch (err) {
        console.error("PDF.js render error:", err);
        if (active) {
          setError("Failed to render PDF preview");
          setLoading(false);
        }
      }
    };

    renderPdf();

    return () => {
      active = false;
    };
  }, [url]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto p-4 bg-[#0d1117]/60 min-h-[300px]">
      {loading && (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">Loading certificate preview...</span>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center justify-center h-64 text-center text-xs text-red-400 p-4">
          <p className="font-semibold">{error}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all"
          >
            Open Native PDF Viewer
          </a>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto rounded-lg shadow-xl border border-white/10 bg-white"
        style={{ display: loading || error ? "none" : "block" }}
      />
    </div>
  );
};


const Certifications: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [activePdfCert, setActivePdfCert] = useState<Certification | null>(null);
  const [certsList, setCertsList] = useState<Certification[]>([]);

  useEffect(() => {
    fetchPortfolioData().then((data) => {
      if (data.certifications && data.certifications.length > 0) {
        const mapped = data.certifications.map((c, idx) => ({
          id: idx + 1,
          title: c.title,
          platform: c.provider || 'Certification Authority',
          issueDate: c.date || '2024 - 2025',
          category: c.level || 'Professional Certification',
          pdfPath: getAssetUrl(c.link || '/images/certificates/Internal SIH.pdf'),
        }));
        setCertsList(mapped);
      }
    });
  }, []);

  // Open PDF preview inside the lightbox modal on both desktop and mobile
  const handleViewCert = (cert: Certification) => {
    setActivePdfCert(cert);
  };

  // Display top 3 by default, or all when expanded
  const displayedCerts = showAll ? certsList : certsList.slice(0, 3);


  return (
    <section id="certifications" className="py-12 sm:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
            Certifications
          </div>
          <h2 className="text-2xl sm:text-5xl font-extrabold text-white">
            Certifications & <span className="text-gradient">Achievements</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-xs sm:text-base">
            Formal achievements in Hackathons, Full Stack Engineering, Big Data Computing, and Innovation Symposiums.
          </p>
        </motion.div>

        {/* Sleek Simple Certifications Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {displayedCerts.map((cert, idx) => {
            const isLastOdd = idx === displayedCerts.length - 1 && displayedCerts.length % 2 !== 0;
            return (
              <div
                key={cert.id}
                className={isLastOdd ? "col-span-2 lg:col-span-1 w-full lg:max-w-none" : "col-span-1"}
              >
                <TiltCard
                  index={idx}
                  flipDirection={idx % 2 === 0 ? "left" : "right"}
                  interactiveTag="Certificate 3D Asset"
                  onClick={() => handleViewCert(cert)}
                >
                  <div className="glass-card glass-card-hover rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/10 flex flex-col justify-between group cursor-pointer relative overflow-hidden h-full">
                    {/* Subtle Top Accent Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 opacity-80" />

                    <div className="space-y-3 md:space-y-4">
                      {/* Top Badge & Date */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[9px] md:text-[11px] font-mono font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 truncate max-w-[65%]">
                          {cert.platform}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-gray-400 font-mono shrink-0">
                          <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-400" />
                          <span>{cert.issueDate}</span>
                        </div>
                      </div>

                      {/* Title & Category */}
                      <div>
                        <h3 className="text-sm md:text-xl font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                          {cert.title}
                        </h3>
                        <div className="text-[10px] md:text-xs text-gray-400 mt-1">
                          {cert.category}
                        </div>
                      </div>
                    </div>

                    {/* Sleek Action Footer */}
                    <div className="pt-3 md:pt-5 mt-4 md:mt-6 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-gray-400">
                        <FileText className="w-3 h-3 md:w-3.5 md:h-3.5 text-purple-400" />
                        <span>PDF</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCert(cert);
                        }}
                        className="rounded-lg md:rounded-xl px-2 py-1 md:px-3 md:py-1.5 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 text-[10px] md:text-xs gap-1 md:gap-1.5"
                      >
                        <Eye className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        <span>View</span>
                      </Button>
                    </div>

                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>

        {/* View More / View Less Toggle Button */}
        <div className="mt-10 text-center">
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            className="px-8 py-5 rounded-2xl font-semibold text-white bg-[#111827]/80 hover:bg-[#111827] border-white/15 hover:border-purple-400/50 shadow-xl gap-2 transition-all duration-300"
          >
            <span>{showAll ? "Show Top 3 Certificates" : `View All Certificates`}</span>
            {showAll ? <ChevronUp className="w-4 h-4 text-purple-400" /> : <ChevronDown className="w-4 h-4 text-purple-400" />}
          </Button>
        </div>

      </div>

      {/* PDF Viewer Lightbox Modal - No Y-Axis Scroll */}
      {activePdfCert && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-[#050816]/95 backdrop-blur-2xl animate-in fade-in duration-200 overflow-hidden"
          onClick={() => setActivePdfCert(null)}
        >
          <div
            className="glass-card rounded-3xl max-w-4xl w-full border border-white/15 overflow-hidden shadow-2xl p-5 sm:p-6 flex flex-col bg-[#111827] max-h-[80vh] sm:max-h-[90vh] h-[60vh] sm:h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
              <div>
                <span className="text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">
                  {activePdfCert.platform} • {activePdfCert.issueDate}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5 leading-snug">
                  {activePdfCert.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activePdfCert.pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open PDF ↗</span>
                </a>
                <button
                  onClick={() => setActivePdfCert(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                  title="Close Lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Embedded PDF Canvas Viewer (renders on all devices without triggering downloads) */}
            <div className="w-full flex-1 my-3 bg-black/80 rounded-2xl border border-white/10 overflow-hidden relative">
              <PdfCanvasViewer url={activePdfCert.pdfPath} />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2 text-xs text-gray-400 shrink-0 border-t border-white/10">
              <span>Category: <strong className="text-white">{activePdfCert.category}</strong></span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActivePdfCert(null)}
                className="px-4 py-1.5 rounded-xl text-xs font-medium border-white/15 text-gray-300 hover:text-white"
              >
                Close Preview
              </Button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </section>
  );
};

export default Certifications;