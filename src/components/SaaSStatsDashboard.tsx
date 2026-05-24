import React, { useState } from "react";
import { HistoryItem } from "../types";
import { ArrowDownToLine, RefreshCw, Layers, ShieldCheck, CreditCard, ChevronRight, Sparkles, LogOut, Check } from "lucide-react";
import { MOCK_HISTORY } from "../data";

interface SaaSStatsDashboardProps {
  history: HistoryItem[];
  userPlan: "Free" | "Pro";
  onUpgradeClick: () => void;
  onReDownload: (item: HistoryItem) => void;
}

export default function SaaSStatsDashboard({
  history,
  userPlan,
  onUpgradeClick,
  onReDownload,
}: SaaSStatsDashboardProps) {
  const [copiedKey, setCopiedKey] = useState(false);

  // Combine mock history and user active conversions
  const combinedHistory = [...history, ...MOCK_HISTORY];
  
  const totalConverted = combinedHistory.length;
  const standardCount = combinedHistory.filter(h => h.aiCategory !== "Mobile UI/UX").length;
  const avgPages = Math.round(combinedHistory.reduce((sum, item) => sum + item.pageCount, 0) / (totalConverted || 1) || 4);
  const totalStorage = combinedHistory.reduce((sum, item) => sum + parseFloat(item.fileSize), 0).toFixed(1);

  // Simple SVG Line Chart Data simulation (daily trends across 7 days)
  const chartDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chartValues = [12, 19, 15, 25, 32, totalConverted + 8, totalConverted + 14];
  const maxVal = Math.max(...chartValues, 40);

  const copyApiKey = () => {
    navigator.clipboard.writeText("b2p_live_5df8a9a2f1837acb790d");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div id="stats_dashboard" className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Overview & Metrics View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Analytics Cards */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-gray-500 mb-4">
                <span className="text-xs font-mono uppercase tracking-wider">Total Converted</span>
                <span className="p-2 bg-purple-50 text-brand-600 rounded-lg">
                  <RefreshCw size={16} />
                </span>
              </div>
              <h4 className="text-4xl font-display font-medium text-gray-900">{totalConverted}</h4>
              <p className="text-xs text-gray-500 mt-2">Active exports in present workspace</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Remaining free conversions:</span>
              <span className="font-semibold text-brand-600 font-mono">
                {userPlan === "Pro" ? "Unlimited" : `${Math.max(0, 3 - history.length)} / 3 today`}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-gray-500 mb-4">
                <span className="text-xs font-mono uppercase tracking-wider">Storage Utilized</span>
                <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Layers size={16} />
                </span>
              </div>
              <h4 className="text-4xl font-display font-medium text-gray-900">{totalStorage} <span className="text-lg text-gray-400">MB</span></h4>
              <p className="text-xs text-gray-500 mt-2">Temporary PDF storage cache active</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Account quota used:</span>
              <span className="font-semibold text-gray-700">
                {userPlan === "Pro" ? `${totalStorage}MB / 10 GB` : `${totalStorage}MB / 100 MB`}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-gray-500 mb-4">
                <span className="text-xs font-mono uppercase tracking-wider">PDF Quality Mode</span>
                <span className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <ShieldCheck size={16} />
                </span>
              </div>
              <h4 className="text-4xl font-display font-medium text-gray-900">
                {userPlan === "Pro" ? "Ultra-HD" : "Standard"}
              </h4>
              <p className="text-xs text-gray-500 mt-2">Export layout compilation target</p>
            </div>
            {userPlan !== "Pro" ? (
              <button
                id="btn_dash_upgrade"
                onClick={onUpgradeClick}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-medium transition-all shadow-xs"
              >
                <Sparkles size={14} /> Upgrade to Pro for HD
              </button>
            ) : (
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-emerald-600 font-medium">
                <span>✓ Pro Active Plan features enabled</span>
              </div>
            )}
          </div>

          {/* Core Analytics Line Chart - Custom pure SVG to ensure React 19 safety */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs md:col-span-2">
            <h5 className="font-display font-medium text-sm text-gray-900 mb-6">SaaS System Conversions Trend (7 Days)</h5>
            <div className="w-full h-48 relative flex items-end">
              {/* Chart lines background grids */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-gray-100 w-full h-0" />
                <div className="border-b border-gray-100 w-full h-0" />
                <div className="border-b border-gray-100 w-full h-0" />
                <div className="border-b border-gray-100 w-full h-0" />
              </div>

              {/* SVG Line & Shadows */}
              <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 400 120" preserveAspectRatio="none">
                {/* Gradient area */}
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 10 110 L 10 ${110 - (chartValues[0]/maxVal)*100} L 75 ${110 - (chartValues[1]/maxVal)*100} L 140 ${110 - (chartValues[2]/maxVal)*100} L 205 ${110 - (chartValues[3]/maxVal)*100} L 270 ${110 - (chartValues[4]/maxVal)*100} L 335 ${110 - (chartValues[5]/maxVal)*100} L 390 ${110 - (chartValues[6]/maxVal)*100} L 390 110 Z`}
                  fill="url(#chartGrad)"
                />
                <path
                  d={`M 10 ${110 - (chartValues[0]/maxVal)*100} L 75 ${110 - (chartValues[1]/maxVal)*100} L 140 ${110 - (chartValues[2]/maxVal)*100} L 205 ${110 - (chartValues[3]/maxVal)*100} L 270 ${110 - (chartValues[4]/maxVal)*100} L 335 ${110 - (chartValues[5]/maxVal)*100} L 390 ${110 - (chartValues[6]/maxVal)*100}`}
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Dots */}
                {chartValues.map((val, idx) => {
                  const xCoord = 10 + idx * 63.3;
                  const yCoord = 110 - (val/maxVal)*100;
                  return (
                    <circle key={idx} cx={xCoord} cy={yCoord} r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                  );
                })}
              </svg>
            </div>
            {/* Chart X Labels */}
            <div className="flex justify-between mt-4 px-2 text-[10px] font-mono text-gray-400">
              {chartDays.map((day, idx) => (
                <span key={idx}>{day} ({chartValues[idx]})</span>
              ))}
            </div>
          </div>

          {/* Quick info panel */}
          <div className="bg-brand-950 text-white p-6 rounded-2xl shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-purple-300 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-wider text-purple-300">Plan Status</span>
              </div>
              <h5 className="font-display text-xl font-medium mb-2">
                {userPlan === "Pro" ? "Behance2PDF Pro" : "Behance2PDF Starter"}
              </h5>
              <p className="text-xs text-purple-200 leading-relaxed">
                {userPlan === "Pro" 
                  ? "You have full, unrestricted access to the high-performance scraper, HD download compiler, and customized case study models." 
                  : "Upgrade to leverage full-bleed Swiss exports, high-DPI image pipelines, and unlimited case studies reviews."
                }
              </p>
            </div>
            {userPlan !== "Pro" ? (
              <button
                id="btn_upgrade_banner"
                onClick={onUpgradeClick}
                className="mt-6 w-full py-2.5 bg-white text-brand-950 font-medium text-xs rounded-xl hover:bg-purple-100 transition-all text-center flex items-center justify-center gap-1.5"
              >
                Unlock Unlimited Access <ChevronRight size={14} />
              </button>
            ) : (
              <div className="mt-6 flex items-center gap-2 text-xs text-purple-200">
                <CreditCard size={14} /> Next payment: June 24, 2026 ($12.00)
              </div>
            )}
          </div>

          {/* Job History Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs md:col-span-3 p-6 mt-2">
            <h5 className="font-display font-medium text-sm text-gray-900 mb-6">Generated PDF Job Reports</h5>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-mono text-gray-400 uppercase tracking-wider pb-3">
                    <th className="py-3 font-semibold">Project Title</th>
                    <th className="py-3 font-semibold">Author(s)</th>
                    <th className="py-3 font-semibold">Category</th>
                    <th className="py-3 font-semibold">Pages</th>
                    <th className="py-3 font-semibold">File Size</th>
                    <th className="py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-gray-600 divide-y divide-gray-50">
                  {combinedHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="py-3.5 pr-2 font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.coverImage}
                            alt=""
                            className="w-10 h-8 rounded object-cover border border-gray-100"
                            referrerPolicy="no-referrer"
                          />
                          <span className="truncate max-w-xs">{item.title}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-gray-500 font-sans truncate max-w-[120px]">{item.author}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 bg-purple-50 text-brand-600 text-[10px] rounded-full font-medium">
                          {item.aiCategory || "General UX"}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono text-gray-500">{item.pageCount} pages</td>
                      <td className="py-3.5 font-mono text-gray-500">{item.fileSize}</td>
                      <td className="py-3.5 text-right font-medium">
                        <button
                          onClick={() => onReDownload(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-brand-600 hover:text-white rounded-lg text-[11px] text-gray-700 transition-all font-sans cursor-pointer"
                        >
                          <ArrowDownToLine size={12} />
                          Re-download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </div>
  );
}
