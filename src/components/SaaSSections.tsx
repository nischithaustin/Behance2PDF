import React, { useState } from "react";
import { Sparkles, ArrowRight, Check, Shield, HelpCircle, Layers, Copy, Cpu, FileText, ChevronDown, Monitor, RefreshCw, Smartphone } from "lucide-react";
import { FAQS } from "../data";

// 1. NAV HEADER COMPONENT
interface NavHeaderProps {
  currentView: "home" | "results";
  onViewChange: (view: "home" | "results") => void;
}

export function NavHeader({ currentView, onViewChange }: NavHeaderProps) {
  return (
    <nav className="glass sticky top-0 z-40 w-full px-6 py-4 flex items-center justify-between font-display">
      <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => onViewChange("home")}>
        <div className="w-8 h-8 rounded-xl premium-gradient flex items-center justify-center shadow-xs">
          <Layers size={16} className="text-white" />
        </div>
        <div>
          <span className="font-bold text-base tracking-tight text-gray-950">Behance<span className="premium-text-gradient">2PDF</span></span>
          <span className="text-[9px] block font-mono text-gray-400 font-medium -mt-1 uppercase tracking-wider">A4 EXPORTER Studio</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-gray-500 ml-auto">
        <button
          onClick={() => onViewChange("home")}
          className={`hover:text-gray-900 transition-colors ${currentView === "home" ? "text-brand-600 font-bold" : ""}`}
        >
          PDF Convert
        </button>
        <a href="#how_it_works" className="hover:text-gray-900 transition-colors">How It Works</a>
        <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
      </div>

      <div className="flex items-center gap-3">
      </div>
    </nav>
  );
}

// 2. HOW IT WORKS SECTION
export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Copy Behance URL",
      desc: "Find any public Behance case study, design board, or profile gallery and copy its browser link from the browser bar."
    },
    {
      num: "02",
      title: "AI Analysis & Split",
      desc: "Our server proxy extracts the layout state instantly. We slice vertical infographic modules to match exact high-DPI A4 guidelines."
    },
    {
      num: "03",
      title: "One-Click PDF Compile",
      desc: "Download a perfectly structured PDF with high-resolution image fidelity, formatted text, and customized design credits."
    }
  ];

  return (
    <section id="how_it_works" className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full">
            How it works
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-950 mt-4 tracking-tight leading-tight">
            Perfect Portfolios, Zero Crop
          </h2>
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            We bypass local system print bugs by analyzing the Behance grid on our backend servers, giving you unmatched digital portfolio exports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-xs relative group transition-all duration-300">
              <span className="text-4xl font-display font-light text-brand-200 block mb-4 group-hover:text-brand-500 transition-colors">
                {step.num}
              </span>
              <h4 className="font-display font-bold text-gray-900 text-lg mb-2">{step.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 3. CORE FEATURES SECTION
export function FeaturesSection() {
  const features = [
    {
      icon: <Cpu className="text-brand-600" size={18} />,
      title: "Gemini AI Critique",
      desc: "Automatically drafts UX design case study text, challenges, and insights from the visual graphics using Google Gemini."
    },
    {
      icon: <Layers className="text-blue-600" size={18} />,
      title: "A4 Slicing Grid Engine",
      desc: "Direct-slices long-vertical portfolio graphics into printable, multi-sheet A4 sections. No image squeeze or text compression."
    },
    {
      icon: <RefreshCw className="text-green-600" size={18} />,
      title: "CORS Image Proxy Support",
      desc: "Our backend serves as a secure proxy to fetch original images from Behance CDN, bypassing browser security blocks."
    },
    {
      icon: <FileText className="text-purple-600" size={18} />,
      title: "Customizable Cover Templates",
      desc: "Prefix your converted PDF files with classic, elegant portfolio table of contents sheets, title block headers, and tags."
    },
    {
      icon: <Smartphone className="text-amber-600" size={18} />,
      title: "Mobile Sticky Controls",
      desc: "100% responsive interface so you can compile PDF links directly on your smartphone to message or email reviewers."
    },
    {
      icon: <Shield className="text-teal-600" size={18} />,
      title: "Clean Print Filters",
      desc: "Strips extraneous footer elements, reviews spam, related widgets, and search bars to prioritize pure design curation."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">
            Built for Designers
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-950 mt-4 tracking-tight">
            Next-Gen Portfolio Exporter features
          </h2>
          <p className="text-xs text-gray-400 mt-2">Everything in one tab, no setup, no complex plugins required.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div key={idx} className="p-6 bg-gray-50 rounded-2xl flex gap-4">
              <div className="p-3 bg-white h-11 w-11 rounded-xl shadow-xs shrink-0 flex items-center justify-center">
                {feat.icon}
              </div>
              <div>
                <h5 className="font-display font-semibold text-gray-900 text-sm mb-1">{feat.title}</h5>
                <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 4. SAAS PRICING SECTION
interface PricingSectionProps {
  onUpgradeSuccess: () => void;
  userPlan: "Free" | "Pro";
}

export function PricingSection({ onUpgradeSuccess, userPlan }: PricingSectionProps) {
  const [loadingUpgrade, setLoadingUpgrade] = useState(false);
  const [showCheckoutOverlay, setShowCheckoutOverlay] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const triggerPaymentSim = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingUpgrade(true);
    // Simulate premium payment processing
    setTimeout(() => {
      setLoadingUpgrade(false);
      setShowCheckoutOverlay(false);
      onUpgradeSuccess();
    }, 1800);
  };

  return (
    <section id="pricing" className="py-20 bg-gray-50 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full">
            Plans
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-950 mt-4 tracking-tight">
            A Plan for Every Workload
          </h2>
          <p className="text-sm text-gray-500 mt-2">Pick the access level that matches your career objectives.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-2xl shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-display font-bold text-gray-900 text-lg">Starter</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">Perfect for students & job seekers</p>
                </div>
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 font-mono text-[9px] font-bold rounded-lg border border-gray-200">
                  FREE
                </span>
              </div>
              <div className="my-6">
                <span className="text-4xl font-display font-bold text-gray-950">$0</span>
                <span className="text-gray-400 text-xs ml-1">/ forever</span>
              </div>

              <ul className="space-y-3.5 text-xs text-gray-600 pb-8 border-b border-gray-100">
                <li className="flex items-center gap-2">
                  <Check className="text-brand-600 shrink-0" size={14} />
                  <span>3 public PDF conversions / day</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-brand-600 shrink-0" size={14} />
                  <span>Standard quality image rendering</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-brand-600 shrink-0" size={14} />
                  <span>Modular vertical canvas slicing</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400 line-through">
                  <span>Ultra-HD image bypass scaling</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400 line-through">
                  <span>Custom cover page options</span>
                </li>
              </ul>
            </div>
            
            <button
              disabled
              className="mt-6 w-full py-2.5 bg-gray-100 text-gray-500 text-xs font-semibold rounded-xl cursor-default text-center"
            >
              Default Plan Active
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-brand-950 text-white p-8 rounded-2xl relative flex flex-col justify-between overflow-hidden shadow-md">
            {/* Ambient Purple background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600 rounded-full blur-3xl opacity-40 pointer-events-none" />

            <div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h4 className="font-display font-bold text-purple-200 text-lg">Premium</h4>
                  <p className="text-[11px] text-purple-300 mt-0.5 whitespace-nowrap">Perfect for consultants & agencies.</p>
                </div>
                <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 font-mono text-[9px] font-bold rounded-lg uppercase tracking-wider">
                  Popular
                </span>
              </div>
              <div className="my-6 relative z-10">
                <span className="text-4xl font-display font-bold">$12</span>
                <span className="text-purple-300 text-xs ml-1">/ month</span>
              </div>

              <ul className="space-y-3.5 text-xs text-purple-100 pb-8 relative z-10">
                <li className="flex items-center gap-2">
                  <Check className="text-purple-300 shrink-0" size={14} />
                  <span><strong>Unlimited</strong> PDF conversions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-purple-300 shrink-0" size={14} />
                  <span><strong>Ultra-HD (1400px)</strong> quality downloads</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-purple-300 shrink-0" size={14} />
                  <span>Unrestricted Gemini AI Case Study reviews</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-purple-300 shrink-0" size={14} />
                  <span>Custom Swiss cover pages & watermarks</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-purple-300 shrink-0" size={14} />
                  <span>Cloud conversion log & API developer keys</span>
                </li>
              </ul>
            </div>

            {userPlan === "Pro" ? (
              <div className="mt-6 w-full py-2.5 bg-purple-600 text-white text-xs font-semibold rounded-xl text-center">
                ✓ Plan Unlocked
              </div>
            ) : (
              <button
                id="btn_trigger_checkout"
                onClick={() => setShowCheckoutOverlay(true)}
                className="mt-6 w-full py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-semibold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer relative z-10"
              >
                Upgrade to Pro <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CHECKOUT SIMULATION MODAL OVERLAY */}
      {showCheckoutOverlay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="premium-gradient p-6 text-white">
              <h4 className="font-display font-medium text-lg">Secure SaaS Checkout</h4>
              <p className="text-xs text-purple-100 mt-1">Upgrade your account to Behance2PDF Pro Plan.</p>
            </div>

            <form onSubmit={triggerPaymentSim} className="p-6 space-y-4">
              <div className="flex justify-between text-xs text-gray-500 pb-3">
                <span>Product Status:</span>
                <span className="font-semibold text-gray-900 font-mono">Pro Membership - $12.00/mo</span>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">User Email</label>
                <input
                  type="email"
                  value="nischithaustin@gmail.com"
                  disabled
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">Credit Card Number</label>
                <input
                  type="text"
                  required
                  placeholder="4111 2222 3333 4444"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim())}
                  maxLength={19}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs font-mono text-gray-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">Expiry Date</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl text-xs font-mono text-gray-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">CVC Security</label>
                  <input
                    type="password"
                    required
                    placeholder="•••"
                    maxLength={3}
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl text-xs font-mono text-gray-700 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  id="btn_cancel_checkout"
                  onClick={() => setShowCheckoutOverlay(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn_submit_checkout"
                  disabled={loadingUpgrade}
                  className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                >
                  {loadingUpgrade ? "Processing..." : "Authorize $12.00"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

// 5. ACCORDION FAQ SECTION
export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
            FAQ Section
          </span>
          <h2 className="font-display font-bold text-3xl text-gray-900 mt-2 tracking-tight">
            Common Questions
          </h2>
        </div>

        <div className="divide-y divide-gray-150">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="py-5 font-sans">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex justify-between items-center text-left py-1 text-sm font-semibold text-gray-950 focus:outline-none cursor-pointer group"
              >
                <span className="group-hover:text-brand-600 transition-colors">{faq.question}</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${openIndex === idx ? "rotate-180 text-brand-600" : ""}`}
                />
              </button>
              {openIndex === idx && (
                <div className="mt-3.5 pr-6 text-xs text-gray-500 leading-relaxed animate-in fade-in duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 6. FOOTER COMPONENT
export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-16 text-xs font-sans">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 text-white mb-4">
            <div className="w-7 h-7 rounded-lg premium-gradient flex items-center justify-center">
              <Layers size={14} className="text-white" />
            </div>
            <span className="font-display font-semibold text-base tracking-tight">Behance2PDF</span>
          </div>
          <p className="max-w-sm text-gray-400 leading-relaxed text-xs">
            A real-time production cloud-native portfolio export toolkit. We transform uncooperative layout scripts and high-res components into beautiful documents in seconds.
          </p>
        </div>

        <div>
          <h5 className="font-display font-semibold text-white uppercase tracking-wider text-[10px] mb-4">Core SaaS Navigation</h5>
          <ul className="space-y-3">
            <li><a href="#faq" className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">FAQ</a></li>
            <li><a href="#how_it_works" className="hover:text-white transition-colors">How It Works</a></li>
          </ul>
        </div>

        <div>
          <h5 className="font-display font-semibold text-white uppercase tracking-wider text-[10px] mb-4">Product Support</h5>
          <p className="text-[10px] text-gray-500 leading-relaxed">
            For business inquiries or bulk licensing for agencies and design firms, please contact our support team.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-[10px]">
        <span>© 2026 Behance2PDF Inc. Designed with Swiss-Minimalism guidelines.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-300">Privacy Policy</a>
          <a href="#" className="hover:text-gray-300">Terms of Service</a>
          <a href="#" className="hover:text-gray-300">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
