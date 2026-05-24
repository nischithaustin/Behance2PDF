import React, { useState, useEffect } from "react";
import {
  FileText,
  Link,
  Sparkles,
  ArrowRight,
  Download,
  AlertCircle,
  RefreshCw,
  FileCode,
  Layout,
  CheckCircle2,
  Trash2,
  ArrowLeft,
  Layers,
  Info,
  Clock,
  Eye,
} from "lucide-react";
import { ProjectData, HistoryItem } from "./types";
import { NavHeader, HowItWorksSection, FaqSection, Footer } from "./components/SaaSSections";
import SaaSStatsDashboard from "./components/SaaSStatsDashboard";
import { jsPDF } from "jspdf";

export default function App() {
  const [behanceUrl, setBehanceUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("Awaiting Project Link...");
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Scraped and parsed project metrics
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  
  // Constant layout style as requested: borderless full-bleed
  const pdfStyle = "borderless";
  const [currentView, setCurrentView] = useState<"home" | "results" | "dashboard">("home");
  const [userPlan, setUserPlan] = useState<"Free" | "Pro">("Free");
  
  // PDF download compilations state
  const [isCompilingPdf, setIsCompilingPdf] = useState(false);
  const [compilingStep, setCompilingStep] = useState("");
  const [compilingProgress, setCompilingProgress] = useState(0);

  // Conversion History
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load plan and history from local storage if available
  useEffect(() => {
    const savedPlan = localStorage.getItem("b2p_plan");
    if (savedPlan === "Pro") setUserPlan("Pro");
    
    const savedHist = localStorage.getItem("b2p_history");
    if (savedHist) {
      try {
        setHistory(JSON.parse(savedHist));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  // Sync plan and history with storage
  const handleUpgradePlan = () => {
    setUserPlan("Pro");
    localStorage.setItem("b2p_plan", "Pro");
  };

  const saveToHistory = (data: ProjectData) => {
    const freshItem: HistoryItem = {
      id: "hist_" + Date.now(),
      url: behanceUrl,
      title: data.title,
      author: data.author,
      coverImage: data.coverImage || data.imageUrls[0],
      timestamp: new Date().toISOString(),
      pageCount: data.imageUrls.length, // borderless doesn't have cover pages
      fileSize: (data.imageUrls.length * 0.75 + 0.5).toFixed(1) + " MB",
      aiCategory: data.aiData.category
    };

    const nextHist = [freshItem, ...history];
    setHistory(nextHist);
    localStorage.setItem("b2p_history", JSON.stringify(nextHist));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("b2p_history");
  };

  // Run mock URL selection for users to test the compilation engine instantly
  const handleTryMockUrl = (url: string) => {
    setBehanceUrl(url);
    const element = document.getElementById("converter_input_card");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Run the core scraping and AI generation pipeline
  const handleStartConversion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!behanceUrl) return;

    setIsLoading(true);
    setError(null);
    setProjectData(null);
    setCurrentView("results"); // Move to custom process view immediately
    
    // Smooth loader progress simulations
    setLoadingStep("Connecting to secure CORS server proxy...");
    setLoadingPercent(12);

    const steps = [
      { msg: "Sending public scrape header request to Behance.net...", pct: 28 },
      { msg: "Bypassing security parameters & reading be-state Javascript JSON...", pct: 45 },
      { msg: "Extracting high-resolution portfolio asset nodes...", pct: 60 },
      { msg: "Feeding text sections to Google Gemini for UX Case Study structure...", pct: 75 },
      { msg: "Generating professional aesthetic critique tags & summarization...", pct: 90 },
      { msg: "Injecting compiled layout structures...", pct: 100 }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setLoadingStep(steps[stepIndex].msg);
        setLoadingPercent(steps[stepIndex].pct);
        stepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1200);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ behanceUrl }),
      });

      clearInterval(interval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process the URL.");
      }

      const data: ProjectData = await response.json();
      setLoadingPercent(100);
      setLoadingStep("Extraction complete!");
      
      // Delay to show completion
      setTimeout(() => {
        setProjectData(data);
        setIsLoading(false);
        saveToHistory(data);
      }, 500);

    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "An unexpected error occurred. Please verify your URL and try keying again.");
      setIsLoading(false);
    }
  };

  // Run the Client-Side visual PDF compiler
  const handleGeneratePdf = async () => {
    if (!projectData) return;
    
    setIsCompilingPdf(true);
    setCompilingProgress(5);
    setCompilingStep("Initializing layout engine canvas...");

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfW = 210;
      const pdfH = 297;
      let isFirstPage = true;

      // 1. COMPILE IMAGES PAGE-BY-PAGE WITH CORS BYPASS AND CANVAS SPLITTING
      const imagesCount = projectData.imageUrls.length;
      const pdfFormatMode = "full";

      for (let i = 0; i < imagesCount; i++) {
        const imageUrl = projectData.imageUrls[i];
        const pageNum = i + 1;
        setCompilingStep(`Scraping high-res visual: page ${pageNum} / ${imagesCount}...`);
        
        // Progress percentage calculated relative to current index
        const calcProgress = Math.round(20 + (i / imagesCount) * 75);
        setCompilingProgress(calcProgress);

        const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
        
        // Load image under canvas
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = proxiedUrl;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => {
            // Direct load alternative
            img.src = imageUrl;
            img.onload = resolve;
            img.onerror = reject;
          };
        });

        const w = img.width;
        const h = img.height;

        const margin = pdfFormatMode === "full" ? 0 : 10;
        const targetW = pdfW - (margin * 2);
        
        // Scale height relative to width
        const scale = targetW / w;
        const targetH = h * scale;

        const maxPageH = pdfH - (margin * 2);

        if (targetH <= maxPageH) {
          // Normal aspect ratio: draw directly on a single page
          if (!isFirstPage) {
            pdf.addPage();
          }
          pdf.addImage(img, "JPEG", margin, margin, targetW, targetH);
          isFirstPage = false;
        } else {
          // VERTICAL PORTFOLIO BOARD! Slicing layout blocks across printable page pages!
          const slicesNeeded = Math.ceil(targetH / maxPageH);
          
          for (let s = 0; s < slicesNeeded; s++) {
            if (!isFirstPage) {
              pdf.addPage();
            }
            
            // Calculate height constraints
            const srcY = (s * maxPageH) / scale;
            const srcH = Math.min(maxPageH / scale, h - srcY);

            // Draw this slice to canvas
            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = srcH;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, srcY, w, srcH, 0, 0, w, srcH);
              const sliceData = canvas.toDataURL("image/jpeg", 0.92);
              const destH = srcH * scale;

              pdf.addImage(sliceData, "JPEG", margin, margin, targetW, destH);
            }
            isFirstPage = false;
          }
        }
      }

      setCompilingStep("Packing and saving PDF binary blob...");
      setCompilingProgress(98);

      // Save PDF output
      const cleanFilename = projectData.title
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, 24);
      
      pdf.save(`${cleanFilename}-Behance2PDF.pdf`);
      
      setCompilingProgress(100);
      setCompilingStep("Ready for download!");

      setTimeout(() => {
        setIsCompilingPdf(false);
      }, 800);

    } catch (pdfErr) {
      console.error("PDF engine crash during draw:", pdfErr);
      setError("PDF drawing failed. An image could not be loaded into the document canvas. Try switching layout format to Borderless.");
      setIsCompilingPdf(false);
    }
  };

  // Re-downloading from Dashboard history
  const handleReDownload = async (item: HistoryItem) => {
    setBehanceUrl(item.url);
    setIsLoading(true);
    setError(null);
    setProjectData(null);
    setCurrentView("results");
    
    setLoadingStep("Connecting cached reference file logs...");
    setLoadingPercent(30);

    try {
      const fetchResponse = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ behanceUrl: item.url }),
      });

      if (!fetchResponse.ok) {
        throw new Error("Could not reload history link references.");
      }

      const freshData: ProjectData = await fetchResponse.json();
      setProjectData(freshData);
      setIsLoading(false);
      
      // Auto-trigger compile
      setTimeout(() => {
        handleGeneratePdf();
      }, 400);

    } catch (e) {
      console.error(e);
      setError("Could not re-download from project logs. The public link might have changed or been removed from Behance.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* SaaS Navigation Header */}
      <NavHeader
        currentView={currentView}
        onViewChange={(v) => {
          setCurrentView(v);
          setError(null);
        }}
      />

      <main className="grow">
        {currentView === "results" ? (
          /* SEPARATE WORKSPACE VIEW FOR ANALYSIS AND RE-EXPORT */
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-350 min-h-screen">
            {/* Dedicated process header */}
            <div className="py-6 px-6">
              <div className="max-w-5xl mx-auto flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-sm">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView("home");
                    setError(null);
                  }}
                  className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-brand-600 transition-colors cursor-pointer px-3 py-2 rounded-xl bg-gray-100 hover:bg-brand-50"
                >
                  <ArrowLeft size={14} /> Back to URL Entry
                </button>
                <div className="flex items-center gap-2 text-xs font-mono font-medium text-gray-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                  WORKSPACE SCREEN
                </div>
              </div>
            </div>

            {/* ERROR NOTIFIER */}
            {error && (
              <div className="max-w-xl mx-auto mb-10 px-4 mt-6">
                <div className="bg-red-50 p-6 rounded-3xl flex gap-4 text-red-700 text-xs shadow-xs">
                  <AlertCircle size={20} className="shrink-0 text-red-600 mt-0.5" />
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm">Conversion Error Detected</h5>
                    <p className="leading-relaxed">{error}</p>
                    <button
                      onClick={() => {
                        setCurrentView("home");
                        setError(null);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 font-bold text-[10px] rounded-xl transition-all cursor-pointer"
                    >
                      <ArrowLeft size={12} /> Go Back to URL Entry
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ANIMATED LOADER COMPONENT (WHILE SCROLL SCRAPING IS ACTIVE) */}
            {isLoading && (
              <div className="max-w-xl mx-auto px-4 py-12 text-center animate-in fade-in zoom-in duration-350">
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-md relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-100">
                    <div
                      className="h-full bg-brand-600 transition-all duration-300 rounded-full"
                      style={{ width: `${loadingPercent}%` }}
                    />
                  </div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4 text-brand-600 animate-bounce">
                    <Layers size={24} />
                  </div>
                  
                  <h4 className="font-display font-bold text-gray-900 text-lg">Scraping Behance Assets...</h4>
                  <p className="text-xs text-gray-400 mt-1 font-mono font-medium">{loadingPercent}% Complete</p>
                  
                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-brand-700 bg-brand-50 py-3 px-4 rounded-2xl max-w-sm mx-auto">
                    <RefreshCw size={12} className="animate-spin text-brand-600 shrink-0" />
                    <span className="truncate text-left">{loadingStep}</span>
                  </div>
                </div>
              </div>
            )}

            {/* HIGH-FIDELITY RESULT WORKSPACE */}
            {projectData && !isLoading && !error && (
              <div className="max-w-5xl mx-auto px-4 mb-24 animate-in fade-in slide-in-from-bottom-5 duration-350">
                {/* Visual Settings Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Download & AI summary */}
                  <div className="space-y-6">

                    {/* AI Insights and Summaries */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm">
                      
                      <div className="flex items-center gap-2 text-brand-600 mb-4 font-mono text-[10px] uppercase tracking-widest font-bold">
                        <Sparkles size={14} />
                        Gemini AI Synthesis
                      </div>

                      <div className="space-y-4 text-xs font-sans">
                        <div>
                          <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1 font-semibold">Project Summary</span>
                          <p className="text-gray-700 leading-relaxed text-xs">
                            {projectData.aiData.summary}
                          </p>
                        </div>

                        <div className="pt-2">
                          <span className="text-[10px] font-mono text-gray-500 uppercase block mb-2 font-semibold">Visual Review Lessons</span>
                          <ul className="space-y-2 list-disc pl-3.5 text-gray-700 leading-normal text-xs">
                            {projectData.aiData.insights.map((ins, idx) => (
                              <li key={idx}>{ins}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-3xl">
                    <div className="flex items-center justify-between pb-3">
                      <div>
                        <h3 className="font-display font-bold text-lg text-gray-900">PDF Portfolio Preview</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Estimated export file count: <span className="font-mono text-brand-700 font-semibold">{projectData.imageUrls.length} Pages</span> • {(projectData.imageUrls.length * 0.75 + 0.5).toFixed(1)} MB size</p>
                      </div>
                      
                      <button
                        id="btn_compile_trigger"
                        onClick={handleGeneratePdf}
                        disabled={isCompilingPdf}
                        className="px-4 py-2 premium-gradient hover:opacity-95 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                      >
                        {isCompilingPdf ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            Compiling...
                          </>
                        ) : (
                          <>
                            <Download size={14} /> Download PDF
                          </>
                        )}
                      </button>
                    </div>

                    {/* PDF Compile Steps loader */}
                    {isCompilingPdf && (
                      <div className="p-3.5 bg-brand-50 rounded-2xl border border-brand-100 text-[11px] text-brand-700 font-mono flex items-center gap-2 truncate">
                        <RefreshCw size={12} className="animate-spin text-brand-600 shrink-0" />
                        <span className="truncate">{compilingStep}</span>
                      </div>
                    )}

                    {/* Page Sheets Scroll Simulator */}
                    <div className="space-y-8 max-h-[650px] overflow-y-auto pr-2 pb-12">
                      
                      {/* Image panel sheets preview loops */}
                      {projectData.imageUrls.map((imgUrl, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-xl shadow-xs pdf-preview-sheet relative flex flex-col justify-between overflow-hidden select-none group">
                          <div className="grow flex items-center justify-center p-2 bg-gray-50 rounded-lg">
                            <img
                              src={imgUrl}
                              alt="Behance project asset"
                              className="max-h-96 w-full object-contain rounded"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="text-[9px] font-mono text-gray-400 pt-3 flex justify-between mt-2 px-2">
                            <span>{projectData.title.substring(0, 24)}...</span>
                            <span>
                              A4 SHEETS: SOURCE BLOCK {idx + 1} OF {projectData.imageUrls.length}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* MAIN CONVERTER/HOMEPAGE VIEW */
          <div className="animate-in fade-in duration-300">
            
            {/* HERO BRAND UNIT */}
            <header className="relative pt-20 pb-16 px-6 text-center overflow-hidden">
              {/* Background ambient lighting */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-4xl mx-auto select-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 font-semibold text-xs border border-brand-100 tracking-tight mb-6">
                  <Sparkles size={12} className="text-brand-600 animate-pulse" />
                  Convert Behance to PDF instantly with Gemini AI
                </span>
                
                <h1 className="font-display font-bold text-4xl md:text-6xl text-gray-900 tracking-tight leading-tight max-w-3xl mx-auto">
                  Export Behance Projects Into Professional <span className="premium-text-gradient">A4 PDFs</span>
                </h1>

                <p className="font-sans text-sm md:text-base text-gray-500 max-w-xl mx-auto mt-5 leading-normal">
                  Our server-side parsing engine extracts your creative assets in full resolution, compiling them into gorgeous Swiss-style case study documents.
                </p>
              </div>
            </header>

            {/* ERROR NOTIFIER (IF ENCOUNTERED BEFORE PAGE TRANSITION) */}
            {error && (
              <div className="max-w-xl mx-auto mb-6 px-4">
                <div className="bg-red-50 p-4 rounded-xl flex gap-3 text-red-700 text-xs shadow-xs">
                  <AlertCircle size={16} className="shrink-0 text-red-600 mt-0.5" />
                  <div>
                    <h5 className="font-semibold">Conversion Error Detected</h5>
                    <p className="mt-1 leading-relaxed">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* CORE CONVERTER CONTROL BOX */}
            <div id="converter_input_card" className="max-w-2xl mx-auto px-4 mb-20 scroll-mt-24">
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-md">
                <form onSubmit={handleStartConversion} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-500 mb-2 font-semibold">
                      PASTE BEHANCE PROJECT URL
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Link size={16} />
                      </div>
                      <input
                        type="url"
                        value={behanceUrl}
                        onChange={(e) => setBehanceUrl(e.target.value)}
                        placeholder="https://www.behance.net/gallery/..."
                        required
                        className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:bg-white focus:outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="btn_submit_conversion"
                    disabled={isLoading || !behanceUrl}
                    className="w-full py-4 premium-gradient hover:opacity-95 text-white font-bold text-sm rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Analyze Portfolio Project <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            </div>

            {/* Supplementary Home sections - Show only on landing page when no result is active */}
            <HowItWorksSection />
            <FaqSection />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
