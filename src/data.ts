import { FaqItem, ReviewItem, HistoryItem } from "./types";

export const FAQS: FaqItem[] = [
  {
    question: "How does Behance2PDF convert long-form presentations?",
    answer: "Unlike standard converters that crop images or compress them onto single pages, our proprietary engine splits long vertical Behance infographic boards into exact A4 pages without distortion. Text modules are extracted and styled alongside your creative assets."
  },
  {
    question: "Does it support high-resolution (HD) images?",
    answer: "Yes! Behance stores images in multiple sizes on their CDN. We automatically detect and request the absolute highest resolution available (1400px width or original filesystem source) to ensure your PDF is crisp and print-ready."
  },
  {
    question: "Do I have to pay to use it?",
    answer: "The Free Plan lets you convert up to 3 public Behance projects per day with high quality. Our Pro Plan offers unlimited conversions, ultra-HD exports, customized cover templates, custom watermarks, and cloud history access."
  },
  {
    question: "How does the AI UX Case Study builder work?",
    answer: "When you analyze a URL, our backend feeds the extracted textual context, labels, and title into a Google Gemini model. It then generates critical design insights, highlights core usability challenges, and drafts a structured UX Case Study automatically."
  },
  {
    question: "Are private projects supported?",
    answer: "No, Behance2PDF requires public project links so that our backend scraper can access the page content. If your project is private, temporarily set it to public on Behance to compile your PDF."
  }
];

export const REVIEWS: ReviewItem[] = [
  {
    name: "Alex Rivera",
    role: "Senior UI/UX Designer @ Apple",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    quote: "Slicing long Behance scrolls into beautiful A4 portfolios has always been a painful core task. Behance2PDF does it elegantly in seconds! The AI summary is incredibly accurate too.",
    rating: 5
  },
  {
    name: "Hiroshi Sato",
    role: "Creative Director @ Dentsu",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    quote: "Our designers save hours daily using this app to export references for agencies and offline client pitches. The visual layout and image crispness are flawlessly preserved.",
    rating: 5
  },
  {
    name: "Emily Watson",
    role: "Portfolio Reviewer @ SCAD",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    quote: "The Swiss layout conversion option paired with the AI-generated UX case studies helps product design students prepare amazing, recruiters-friendly PDF pitch decks.",
    rating: 5
  }
];

// Pre-configured mock conversions to give users immediate interactive mock-up trials of the PDF functionality!
export const MOCK_HISTORY: HistoryItem[] = [
  {
    id: "hist_1",
    url: "https://www.behance.net/gallery/183921035/Food-Delivery-App-Case-Study",
    title: "EcoBite - Redefining Hyperlocal Food Delivery",
    author: "Elena Petrova, Marcus Dane",
    coverImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
    timestamp: "2026-05-24T05:32:00Z",
    pageCount: 6,
    fileSize: "4.8 MB",
    aiCategory: "Mobile UI/UX"
  },
  {
    id: "hist_2",
    url: "https://www.behance.net/gallery/192038103/Minimalist-Branding-Identity",
    title: "Synthesize.co - Modular Visual Architecture",
    author: "Julian Karr",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    timestamp: "2026-05-23T18:12:00Z",
    pageCount: 4,
    fileSize: "3.2 MB",
    aiCategory: "Brand Identity"
  },
  {
    id: "hist_3",
    url: "https://www.behance.net/gallery/174920199/Modern-Editorial-Design-System",
    title: "NEO-ARCH - 2026 Annual Architectural Chronology",
    author: "Studio Nord",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    timestamp: "2026-05-22T09:41:00Z",
    pageCount: 8,
    fileSize: "6.1 MB",
    aiCategory: "Editorial Design"
  }
];
