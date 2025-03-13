import express from "express";
import dotenv from "dotenv";
import sessionMiddleware from "./modules/sessionMiddleware.mjs";
import dataRoutes from "./routes/dataRoutes.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import HTTP_CODES from "./utils/httpCodes.mjs";

dotenv.config();

const server = express();
const port = process.env.PORT || 8000;

server.set("port", port);
server.use(express.json());

server.use(express.static("public"));

server.use((req, res, next) => {
  const ignoredPaths = ["/favicon.ico", "/sw.js", "/manifest.webmanifest"];
  if (ignoredPaths.includes(req.url) || req.url.startsWith("/icons/") || req.url.endsWith(".css") || req.url.endsWith(".js")) {
    return next();
  }
  
  console.log(`🔥 Handling request: ${req.method} ${req.url}`);
  next();
});

server.use(sessionMiddleware);

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://prosjekt-app2.onrender.com");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, X-Session-ID");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(HTTP_CODES.SUCCESS.NO_CONTENT);
  }

  next();
});

server.use("/", dataRoutes);
server.use("/auth", authRoutes);

server.use((req, res) => {
  res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ error: "Route not found" });
});

server.listen(server.get("port"), () => {
  console.log(`Server running on http://localhost:${server.get("port")}`);
});

export default server;
