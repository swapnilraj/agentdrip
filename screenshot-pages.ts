import WebSocket from "ws";
import fs from "fs";
import path from "path";
import http from "http";

const WS_URL = "ws://localhost:9222/devtools/page/72A4676F98D0BB50459A8EF1B0A97177";
const TEST_PAGES = "/Users/swp/dev/swapnilraj/design-skill/test-pages";
const SCREENSHOTS = "/Users/swp/dev/swapnilraj/design-skill/screenshots";

// Simple local HTTP server to serve the HTML files
const server = http.createServer((req, res) => {
  const filePath = path.join(TEST_PAGES, decodeURIComponent(req.url || "/"));
  if (fs.existsSync(filePath) && filePath.endsWith(".html")) {
    res.writeHead(200, { "Content-Type": "text/html" });
    // Inject color-scheme meta to prevent Chrome auto dark mode
    // Skip for intentionally dark pages (04-y2k, 06-pixel, 09-dark)
    const rawHtml = fs.readFileSync(filePath, "utf-8");
    const basename = path.basename(req.url || "");
    const isDark = basename.startsWith("04-") || basename.startsWith("06-") || basename.startsWith("09-");
    const html = isDark ? rawHtml : rawHtml.replace("<head>", '<head><meta name="color-scheme" content="light only">');
    res.end(html);
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

const PORT = 8765;

function screenshotPage(url: string, filepath: string, wait = 3000): Promise<void> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(WS_URL);
    let msgId = 0;
    ws.on("open", () => {
      // Disable auto dark mode AND force light color scheme
      ws.send(JSON.stringify({ id: ++msgId, method: "Emulation.setAutoDarkModeOverride", params: { enabled: false } }));
    });
    ws.on("message", (data: any) => {
      const msg = JSON.parse(data.toString());
      if (msg.id === 1) {
        // Also set emulated media for prefers-color-scheme
        ws.send(JSON.stringify({ id: ++msgId, method: "Emulation.setEmulatedMedia", params: { features: [{ name: "prefers-color-scheme", value: "light" }] } }));
      }
      if (msg.id === 2) {
        // Navigate
        ws.send(JSON.stringify({ id: ++msgId, method: "Page.navigate", params: { url } }));
      }
      if (msg.id === 3) {
        setTimeout(() => {
          ws.send(JSON.stringify({ id: ++msgId, method: "Page.captureScreenshot", params: { format: "png" } }));
        }, wait);
      }
      if (msg.id === 3) {
        // After navigate, inject color-scheme override and wait
        setTimeout(() => {
          ws.send(JSON.stringify({ id: ++msgId, method: "Runtime.evaluate", params: { expression: "document.documentElement.style.colorScheme = 'light'" } }));
        }, 500);
      }
      if (msg.id === 4) {
        setTimeout(() => {
          ws.send(JSON.stringify({ id: ++msgId, method: "Page.captureScreenshot", params: { format: "png" } }));
        }, wait - 500);
      }
      if (msg.id === 5 && msg.result) {
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, Buffer.from(msg.result.data, "base64"));
        console.log(`  saved ${path.basename(filepath)}`);
        ws.close();
        resolve();
      }
    });
    ws.on("error", reject);
    setTimeout(() => { ws.close(); reject(new Error("timeout: " + url)); }, 15000);
  });
}

async function main() {
  server.listen(PORT, () => console.log(`Serving test pages on http://localhost:${PORT}`));

  const files = fs.readdirSync(TEST_PAGES).filter(f => f.endsWith(".html")).sort();
  console.log(`\nFound ${files.length} test pages to screenshot\n`);

  for (const file of files) {
    const name = file.replace(".html", "");
    const url = `http://localhost:${PORT}/${file}`;
    const outPath = path.join(SCREENSHOTS, `${name}.png`);
    try {
      await screenshotPage(url, outPath, 2000);
    } catch (e) {
      console.log(`  ERROR: ${file}: ${e}`);
    }
  }

  // Also screenshot scrolled versions for longer pages
  console.log("\nDone screenshotting all pages.");
  server.close();
  process.exit(0);
}

main();
