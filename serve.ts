// DealHound local server: serves app/ at http://localhost:8080 so the site
// can be opened in a desktop browser and screenshotted. Node 22, standard
// library only. Usage: node serve.ts [--port 8080]

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.argv.find((a) => a.startsWith("--port="))?.split("=")[1] ?? 8080);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const file = join(here, "app", path === "/" ? "index.html" : path);
    if (!file.startsWith(join(here, "app"))) {
      res.writeHead(403);
      res.end("forbidden");
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
});

server.listen(port, () => console.log("DealHound at http://localhost:" + port));
