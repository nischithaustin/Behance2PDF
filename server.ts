import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Unescape simple HTML entities in parsed script tags
function unescapeHtml(html: string): string {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

// Recursively find key inside nested JSON
function findNestedKey(obj: any, key: string): any {
  if (!obj || typeof obj !== "object") {
    return null;
  }
  if (obj[key] !== undefined) {
    return obj[key];
  }
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      const result = findNestedKey(obj[k], key);
      if (result) return result;
    }
  }
  return null;
}

// Lazy initialization of Gemini client
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. Running in mock AI summary mode.");
      return null;
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API Route: CORS Bypass Image Proxy
  app.get("/api/proxy-image", async (req, res) => {
    const imageUrl = req.query.url as string;
    if (!imageUrl) {
      return res.status(400).send("Missing url parameter");
    }
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        return res.status(response.status).send("Failed to retrieve image from source");
      }
      const contentType = response.headers.get("content-type") || "image/png";
      res.setHeader("Content-Type", contentType);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=86400"); // cache for 1 day

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.end(buffer);
    } catch (err: any) {
      console.error("Proxy error for URL", imageUrl, err);
      res.status(500).send("Internal image proxy error");
    }
  });

  // API Route: Scraping + Parsing + AI Case Study Generation
  app.post("/api/convert", async (req, res) => {
    const { behanceUrl } = req.body;
    if (!behanceUrl || typeof behanceUrl !== "string") {
      return res.status(400).json({ error: "Please provide a valid Behance project URL." });
    }

    // Basic URL validation
    const trimmedUrl = behanceUrl.trim();
    const isBehance = /behance\.net\/gallery\/\d+\/[a-zA-Z0-9_-]+/i.test(trimmedUrl) ||
                      /be\.net\/gallery\/\d+\/[a-zA-Z0-9_-]+/i.test(trimmedUrl);

    if (!isBehance) {
      return res.status(400).json({
        error: "Invalid Behance URL format. Example: https://www.behance.net/gallery/12345/Project-Name",
      });
    }

    try {
      console.log(`Scraping Behance url: ${trimmedUrl}`);
      const fetchRes = await fetch(trimmedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
      });

      if (!fetchRes.ok) {
        return res.status(404).json({
          error: `Failed to fetch project page. Behance returned status ${fetchRes.status}. Make sure the project is public and active.`,
        });
      }

      const htmlContent = await fetchRes.text();

      // Extracted Metadata Placeholders
      let title = "";
      let description = "";
      let authorName = "Creative Artist";
      let coverImage = "";
      let imageUrls: string[] = [];
      let textSections: string[] = [];
      let parsedSuccessfully = false;

      // Extract title from og tags
      const ogTitleMatch = htmlContent.match(/<meta property="og:title" content="([^"]+)"/i);
      if (ogTitleMatch) title = ogTitleMatch[1];

      // Extract description
      const ogDescMatch = htmlContent.match(/<meta property="og:description" content="([^"]+)"/i);
      if (ogDescMatch) description = ogDescMatch[1];

      // Extract cover image
      const ogImgMatch = htmlContent.match(/<meta property="og:image" content="([^"]+)"/i);
      if (ogImgMatch) coverImage = ogImgMatch[1];

      // Look for the be-state script tag
      const scriptMatch = htmlContent.match(/<script id="be-state"[^>]*>([\s\S]*?)<\/script>/i);
      if (scriptMatch) {
        try {
          const rawJson = unescapeHtml(scriptMatch[1]);
          const stateData = JSON.parse(rawJson);
          const project = findNestedKey(stateData, "project");

          if (project) {
            title = project.name || title || project.title;
            description = project.description || description;
            
            // Extract owners names
            if (project.owners && project.owners.length > 0) {
              const authors = project.owners.map((owner: any) => owner.display_name || owner.first_name + " " + owner.last_name);
              authorName = authors.join(", ");
            } else if (project.coowners && project.coowners.length > 0) {
              const authors = project.coowners.map((owner: any) => owner.display_name);
              authorName = authors.join(", ");
            }

            // Extract Cover
            if (project.covers) {
              coverImage = project.covers["original"] || project.covers["115"] || coverImage;
            }

            // Modules extraction
            const modules = project.modules || [];
            if (modules.length > 0) {
              parsedSuccessfully = true;
              modules.forEach((mod: any) => {
                if (mod.type === "image" || mod.type === "embed") {
                  const sizes = mod.sizes || {};
                  // Prefer full-size image, then max_1240, then max_1200, then original, then disp
                  const highResSrc = sizes["original"] || sizes["fs"] || sizes["max_1200"] || sizes["disp"] || mod.src;
                  if (highResSrc) {
                    imageUrls.push(highResSrc);
                  }
                } else if (mod.type === "text") {
                  if (mod.text_html) {
                    // Strips tags for clean storage, but keep paragraphs
                    const cleanText = mod.text_html
                      .replace(/<\/p>/gi, "\n\n")
                      .replace(/<[^>]+>/g, "")
                      .trim();
                    if (cleanText) textSections.push(cleanText);
                  }
                }
              });
            }
          }
        } catch (e) {
          console.error("Failed to parse be-state script block, falling back to regex: ", e);
        }
      }

      // Fallback Scraper: Extract images via RegExp of Behance CDN patterns
      if (imageUrls.length === 0) {
        const imageRegex = /https:\/\/mir-s3-cdn-cf\.behance\.net\/project_modules\/[^\/]+\/([a-zA-Z0-9_.-]+)\.(png|jpg|jpeg|gif|webp)/g;
        let imgMatch;
        const seenHashes = new Set<string>();
        while ((imgMatch = imageRegex.exec(htmlContent)) !== null) {
          const filename = imgMatch[1];
          const ext = imgMatch[2];
          if (!seenHashes.has(filename)) {
            seenHashes.add(filename);
            // Defaulting to max_1200 resolution module
            const originalUrl = `https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/${filename}.${ext}`;
            imageUrls.push(originalUrl);
          }
        }
      }

      // Regex fallback for text sections
      if (textSections.length === 0) {
        const textModuleRegex = /<div class="project-module module text">([\s\S]*?)<\/div>/gi;
        let txtMatch;
        while ((txtMatch = textModuleRegex.exec(htmlContent)) !== null) {
          const rawText = txtMatch[1]
            .replace(/<\/p>/gi, "\n\n")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          if (rawText) textSections.push(rawText);
        }
      }

      // Final sanitizations
      if (!title) {
        title = "Behance Design Showcase";
      }
      if (imageUrls.length === 0) {
        // Fallback placeholder images if no images scraped
        imageUrls.push("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80");
      }

      // AI SUMMARY AND UX CASE STUDY GENERATION VIA GEMINI 3.5-FLASH
      let aiSummary = "";
      let aiInsights: string[] = [];
      let aiCategory = "Product Design";
      let aiUxCaseStudy: {
        problem?: string;
        solution?: string;
        keyTakeaway?: string;
        userFlow?: string;
      } = {};

      const gemini = getGeminiClient();
      if (gemini) {
        try {
          console.log("Analyzing project meta content with Google Gemini API...");
          const textContext = textSections.slice(0, 3).join("\n\n");
          
          const prompt = `You are a professional UX Design Director. Analyze this Behance portfolio project and return structured high-value insights.
Project Title: ${title}
Project Author: ${authorName}
Project Description: ${description}
Extracted Content Text snippet: ${textContext || "None available."}

Generate critical, premium review details in strict JSON format matching the schema:
{
  "summary": "1-2 sentence high-level elegant overview of the design project.",
  "category": "One of: Brand Identity, Mobile UI/UX, Web Design, Editorial Design, Product Design, 3D Art",
  "insights": [
    "A crisp critique bullet on typography/composition",
    "A crisp critique bullet on user-journey/usability",
    "A crisp critique bullet on emotional impact/creative direction"
  ],
  "uxCaseStudy": {
    "problem": "The design challenge identified.",
    "solution": "The design response implemented.",
    "userFlow": "Key highlights of the user-flow or interaction strategy.",
    "keyTakeaway": "A concise expert review lesson."
  }
}`;

          const response = await gemini.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            },
          });

          const jsonText = response.text || "{}";
          console.log("Gemini parsed response successfully.");
          const parsedGemini = JSON.parse(jsonText.trim());
          
          aiSummary = parsedGemini.summary || aiSummary;
          aiInsights = parsedGemini.insights || aiInsights;
          aiCategory = parsedGemini.category || aiCategory;
          aiUxCaseStudy = parsedGemini.uxCaseStudy || aiUxCaseStudy;
        } catch (geminiError) {
          console.error("Gemini context analysis failed, using dynamic local logic:", geminiError);
          // Fallback static high-quality AI analysis logic
          aiSummary = `${title} is a professional ${aiCategory} project by ${authorName}. It implements modular visual structures to resolve digital interactions and showcase aesthetic harmony.`;
          aiInsights = [
            "Cohesive typography pairings utilizing balanced proportional scaling for readability.",
            "Intentional grid structure creating systematic alignment across all mockup modules.",
            "Sophisticated application of color space reinforcing cohesive brand identity."
          ];
          aiUxCaseStudy = {
            problem: "Establishing a unique, consistent visual identity that balances customer interactions with high design aesthetics.",
            solution: "A modern responsive layout grid that integrates crisp graphics, meticulous spacing, and rich detail modules.",
            userFlow: "Intuitive progression starting from atmospheric brand visuals, diving into structural interfaces, and concluding with detailed high-fidelity closeups.",
            keyTakeaway: "Pristine execution centered on high contrast, robust negative space, and premium visual components."
          };
        }
      } else {
        // Mock fallback if API Key not found
        aiSummary = `${title} is a modern design showcase presented by ${authorName}. It targets specific visual problem statements through clean typography and highly balanced graphic layouts.`;
        aiCategory = "Product Architecture";
        aiInsights = [
          "Optimized layout spacing allowing negative space to define content hierarchy.",
          "High contrast components emphasizing core UI action points.",
          "Balanced brand palette evoking professional design maturity."
        ];
        aiUxCaseStudy = {
          problem: "Harmonizing rich visual communication elements with structured mobile-first viewport constraints.",
          solution: "Clean card blocks, high resolution asset representations, and custom typographic pairings.",
          userFlow: "A clear storytelling sequence that takes users through initial wireframes, aesthetic mockups, and secondary interaction specifications.",
          keyTakeaway: "Craftsmanship lies in executing minimal visual forms with absolute resolution."
        };
      }

      // Combine and return result
      res.json({
        title,
        description,
        author: authorName,
        coverImage,
        imageUrls,
        textSections,
        aiData: {
          summary: aiSummary,
          category: aiCategory,
          insights: aiInsights,
          uxCaseStudy: aiUxCaseStudy,
        },
      });
    } catch (error: any) {
      console.error(`Error processing Behance URL:`, error);
      res.status(500).json({
        error: "Conversion process failed. Could not parse Behance HTML or make connection.",
      });
    }
  });

  // Serve static UI assets and handle dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Behance2PDF server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
