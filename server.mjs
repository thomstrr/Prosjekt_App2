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

server.use(sessionMiddleware);
server.use(express.static("public"));

server.get("/", (req, res) => {
  res.send("Workout Tracker API is running");
});

server.use("/", dataRoutes);
server.use("/auth", authRoutes);

server._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(
      `Method: ${Object.keys(
        middleware.route.methods
      )[0].toUpperCase()} - Path: ${middleware.route.path}`
    );
  } else if (middleware.name === "router") {
    middleware.handle.stack.forEach((route) => {
      if (route.route) {
        console.log(
          `Method: ${Object.keys(
            route.route.methods
          )[0].toUpperCase()} - Path: ${route.route.path}`
        );
      }
    });
  }
});

server.use((req, res) => {
  res
    .status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND)
    .json({ error: "Route not found" });
});

server.listen(server.get("port"), () => {
  console.log(`Server running on http://localhost:${server.get("port")}`);
});

export default server;
