import http from "http";
import fs from "fs";
import path from "path";

const TEST_PAGES = "/Users/swp/dev/swapnilraj/design-skill/test-pages";
const PORT = 3333;

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url || "/");
  
  if (url === "/") {
    // Index page listing all test pages grouped by style
    const files = fs.readdirSync(TEST_PAGES).filter(f => f.endsWith(".html")).sort();
    const styles: Record<string, string[]> = {};
    for (const f of files) {
      const prefix = f.replace(/-.*/, "");
      if (!styles[prefix]) styles[prefix] = [];
      styles[prefix].push(f);
    }
    const names: Record<string, string> = {
      "01": "Brutalist", "02": "Swiss International", "03": "Japanese Minimal",
      "04": "Y2K", "05": "Editorial", "06": "Retro Pixel",
      "07": "Organic Soft", "08": "Neo-Brutalist", "09": "Dark Luxury", "10": "Archival Research"
    };
    let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Design Skills</title>
    <style>body{font-family:system-ui;max-width:800px;margin:40px auto;padding:0 20px}
    h1{margin-bottom:8px}h2{margin-top:32px;border-top:1px solid #ddd;padding-top:16px}
    a{color:#0066cc;text-decoration:none}a:hover{text-decoration:underline}
    .links{display:flex;gap:16px;margin-top:8px}</style></head><body>
    <h1>Design Skill Test Pages</h1><p>10 styles × 3 page types = 30 pages</p>`;
    for (const [prefix, files] of Object.entries(styles)) {
      html += `<h2>${prefix}. ${names[prefix]}</h2><div class="links">`;
      for (const f of files) {
        const type = f.replace(/^\d+-\w+-/, "").replace(".html", "");
        html += `<a href="/${f}" target="_blank">${type}</a>`;
      }
      html += `</div>`;
    }
    html += `</body></html>`;
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
    return;
  }

  const filePath = path.join(TEST_PAGES, url.slice(1));
  if (fs.existsSync(filePath) && filePath.endsWith(".html")) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(fs.readFileSync(filePath, "utf-8"));
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`Serving at http://localhost:${PORT}`);
});
