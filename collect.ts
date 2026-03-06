import WebSocket from "ws";
import fs from "fs";
import path from "path";

const CORPUS = "/Users/swp/dev/swapnilraj/design-skill/corpus";

// Tab websocket URLs
const SAME = "ws://localhost:9222/devtools/page/72A4676F98D0BB50459A8EF1B0A97177";
const ARENA = "ws://localhost:9222/devtools/page/19ACD1037E74F796E0BDE273CB3E8053";
const COSMOS = "ws://localhost:9222/devtools/page/7C01B70B73F232859733BF73244407C9";

function navigateAndScreenshot(wsUrl: string, url: string, filepath: string, wait = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    ws.on("open", () => {
      ws.send(JSON.stringify({ id: 1, method: "Page.navigate", params: { url } }));
    });
    ws.on("message", (data: any) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === 1) {
        setTimeout(() => {
          ws.send(JSON.stringify({ id: 2, method: "Page.captureScreenshot", params: { format: "png" } }));
        }, wait);
      }
      if (msg.id === 2 && msg.result) {
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, Buffer.from(msg.result.data, "base64"));
        console.log(`  saved ${path.basename(filepath)}`);
        ws.close();
        resolve();
      }
    });
    ws.on("error", reject);
    setTimeout(() => { ws.close(); reject(new Error("timeout: " + url)); }, 20000);
  });
}

function scrollAndScreenshot(wsUrl: string, scrollY: number, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    ws.on("open", () => {
      ws.send(JSON.stringify({ id: 1, method: "Runtime.evaluate", params: { expression: `window.scrollTo(0, ${scrollY}); true` } }));
    });
    ws.on("message", (data: any) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === 1) {
        setTimeout(() => {
          ws.send(JSON.stringify({ id: 2, method: "Page.captureScreenshot", params: { format: "png" } }));
        }, 2000);
      }
      if (msg.id === 2 && msg.result) {
        fs.writeFileSync(filepath, Buffer.from(msg.result.data, "base64"));
        console.log(`  saved ${path.basename(filepath)}`);
        ws.close();
        resolve();
      }
    });
    ws.on("error", reject);
    setTimeout(() => { ws.close(); reject(new Error("timeout scroll")); }, 15000);
  });
}

interface StyleConfig {
  dir: string;
  sameQuery: string;
  arenaQuery: string;
  cosmosTab?: string;
  realSites: string[];
}

const styles: StyleConfig[] = [
  {
    dir: "01-brutalist",
    sameQuery: "brutalist web design",
    arenaQuery: "brutalist web design",
    realSites: ["https://brutalistwebsites.com", "https://www.cameronsworld.net", "https://motherfuckingwebsite.com"]
  },
  {
    dir: "02-swiss-international",
    sameQuery: "swiss international typography poster",
    arenaQuery: "swiss design grid",
    cosmosTab: "Typography",
    realSites: ["https://www.swissted.com", "https://www.typographicposters.com"]
  },
  {
    dir: "03-japanese-minimal",
    sameQuery: "japanese minimalist design",
    arenaQuery: "japanese minimalism graphic",
    realSites: ["https://muji.com", "https://www.monocle.com"]
  },
  {
    dir: "04-y2k",
    sameQuery: "y2k aesthetic design interface",
    arenaQuery: "y2k web design",
    realSites: ["https://y2kaestheticinstitute.tumblr.com", "https://poolsuite.net"]
  },
  {
    dir: "05-editorial",
    sameQuery: "editorial design magazine layout",
    arenaQuery: "editorial design layout",
    realSites: ["https://www.bloomberg.com/businessweek", "https://www.theparisreview.org"]
  },
  {
    dir: "06-retro-pixel",
    sameQuery: "retro pixel art interface",
    arenaQuery: "pixel art interface",
    realSites: ["https://www.windows93.net", "https://poolsuite.net"]
  },
  {
    dir: "07-organic-soft",
    sameQuery: "soft rounded ui pastel design",
    arenaQuery: "soft ui design rounded",
    cosmosTab: "UI/UX",
    realSites: ["https://www.headspace.com", "https://linear.app"]
  },
  {
    dir: "08-neo-brutalist",
    sameQuery: "neo brutalist design colorful bold",
    arenaQuery: "neo brutalist web",
    realSites: ["https://www.gumroad.com", "https://figma.com"]
  },
  {
    dir: "09-dark-luxury",
    sameQuery: "dark luxury web design minimal",
    arenaQuery: "dark mode luxury website",
    realSites: ["https://linear.app", "https://vercel.com", "https://stripe.com"]
  },
  {
    dir: "10-archival-research",
    sameQuery: "archival research interface minimal",
    arenaQuery: "archive interface research",
    realSites: ["https://www.are.na", "https://www.wikipedia.org", "https://archive.org"]
  }
];

async function collectForStyle(style: StyleConfig) {
  const base = path.join(CORPUS, style.dir);
  console.log(`\n=== Collecting: ${style.dir} ===`);

  // 1. Same Energy search + scroll
  try {
    await navigateAndScreenshot(SAME, `https://same.energy/search?q=${encodeURIComponent(style.sameQuery)}`, path.join(base, "same-1.png"), 5000);
    await scrollAndScreenshot(SAME, 800, path.join(base, "same-2.png"));
    await scrollAndScreenshot(SAME, 1600, path.join(base, "same-3.png"));
  } catch (e) { console.log(`  same energy error: ${e}`); }

  // 2. Are.na search
  try {
    await navigateAndScreenshot(ARENA, `https://www.are.na/search/${encodeURIComponent(style.arenaQuery)}`, path.join(base, "arena-1.png"), 5000);
    await scrollAndScreenshot(ARENA, 800, path.join(base, "arena-2.png"));
  } catch (e) { console.log(`  arena error: ${e}`); }

  // 3. Cosmos explore tab
  if (style.cosmosTab) {
    try {
      await navigateAndScreenshot(COSMOS, "https://www.cosmos.so/explore", path.join(base, "cosmos-1.png"), 4000);
      // Click the tab
      const clickExpr = `
        const tabs = document.querySelectorAll('a, button, [role="tab"]');
        const tab = Array.from(tabs).find(t => t.textContent.trim() === '${style.cosmosTab}');
        if (tab) { tab.click(); 'clicked'; } else { 'not found'; }
      `;
      await new Promise<void>((resolve, reject) => {
        const ws = new WebSocket(COSMOS);
        ws.on("open", () => {
          ws.send(JSON.stringify({ id: 1, method: "Runtime.evaluate", params: { expression: clickExpr } }));
        });
        ws.on("message", (data: any) => {
          const msg = JSON.parse(data.toString());
          if (msg.id === 1) {
            setTimeout(() => {
              ws.send(JSON.stringify({ id: 2, method: "Page.captureScreenshot", params: { format: "png" } }));
            }, 3000);
          }
          if (msg.id === 2 && msg.result) {
            fs.writeFileSync(path.join(base, "cosmos-2.png"), Buffer.from(msg.result.data, "base64"));
            console.log(`  saved cosmos-2.png`);
            ws.close();
            resolve();
          }
        });
        ws.on("error", reject);
        setTimeout(() => { ws.close(); reject(new Error("timeout cosmos")); }, 15000);
      });
    } catch (e) { console.log(`  cosmos error: ${e}`); }
  } else {
    // Just get cosmos explore for context
    try {
      await navigateAndScreenshot(COSMOS, "https://www.cosmos.so/explore", path.join(base, "cosmos-1.png"), 4000);
    } catch (e) { console.log(`  cosmos error: ${e}`); }
  }

  // 4. Real reference sites
  for (let i = 0; i < style.realSites.length; i++) {
    try {
      await navigateAndScreenshot(SAME, style.realSites[i], path.join(base, `ref-${i + 1}.png`), 5000);
    } catch (e) { console.log(`  ref site error: ${e}`); }
  }
}

// Collect all styles sequentially
for (const style of styles) {
  await collectForStyle(style);
}

console.log("\n=== DONE collecting corpus ===");
