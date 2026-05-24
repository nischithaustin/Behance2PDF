export interface AiUxCaseStudy {
  problem?: string;
  solution?: string;
  userFlow?: string;
  keyTakeaway?: string;
}

export interface AiData {
  summary: string;
  category: string;
  insights: string[];
  uxCaseStudy: AiUxCaseStudy;
}

export interface ProjectData {
  title: string;
  description: string;
  author: string;
  coverImage: string;
  imageUrls: string[];
  textSections: string[];
  aiData: AiData;
}

export interface HistoryItem {
  id: string;
  url: string;
  title: string;
  author: string;
  coverImage: string;
  timestamp: string;
  pageCount: number;
  fileSize: string; // e.g. "4.2 MB"
  aiCategory?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ReviewItem {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}
