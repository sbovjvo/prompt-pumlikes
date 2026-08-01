import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const publicDir = join(process.cwd(), "public");
const port = Number(process.env.PORT || 3000);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  if (url.pathname === "/health") {
    res.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
    return res.end(JSON.stringify({ status: "ok", mode: "prompt-only" }));
  }

  const requested = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\/+/, "");
  const file = normalize(join(publicDir, requested));
  if (!file.startsWith(publicDir) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    return res.end("ไม่พบหน้านี้");
  }

  const extension = extname(file);
  const cacheControl = [".html", ".css", ".js"].includes(extension) ? "no-cache" : "public, max-age=3600";
  res.writeHead(200, {
    "content-type": types[extension] || "application/octet-stream",
    "cache-control": cacheControl,
    "x-content-type-options": "nosniff"
  });
  createReadStream(file).pipe(res);
}).listen(port, "0.0.0.0", () => {
  console.log(`Prompt Pumlikes running on port ${port}`);
});
