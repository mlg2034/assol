/**
 * Жергілікті статика. Іске қосу: npm run dev
 */

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
};

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(err.code === "ENOENT" ? 404 : 500);
      res.end();
      return;
    }
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405);
    res.end();
    return;
  }

  let urlPath = decodeURIComponent(new URL(req.url || "/", "http://x").pathname);
  if (urlPath.includes("..")) {
    res.writeHead(400);
    res.end();
    return;
  }

  if (urlPath === "/") urlPath = "/index.html";

  const filePath = path.join(__dirname, urlPath);
  fs.stat(filePath, (err, st) => {
    if (!err && st.isDirectory()) {
      return sendFile(res, path.join(filePath, "index.html"));
    }
    sendFile(res, filePath);
  });
});

var listenAnnounced = false;
server.listen(0, function () {
  if (listenAnnounced) return;
  listenAnnounced = true;
  var addr = server.address();
  var n = addr && typeof addr === "object" ? addr.port : 0;
  console.log("http://127.0.0.1:" + n + "/");
});
