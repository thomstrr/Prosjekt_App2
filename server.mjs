import express from "express";
import dotenv from "dotenv";
import dataRoutes from "./routes/dataRoutes.mjs";
import { sessionMiddleware } from "./modules/sessionMiddleware.mjs";
import HTTP_CODES from "./utils/httpCodes.mjs";

dotenv.config();

const server = express();
const port = process.env.PORT || 8000;

server.set("port", port);
server.use(express.json());
server.use(sessionMiddleware);
server.use(express.static("public"));

server.get("/", (req, res) => {
  res.send("Workout Tracker API is running");
});

console.log("Loading /workouts route...");
server.use("/workouts", dataRoutes);

console.log("Registrerte ruter:");
server._router.stack.forEach((route) => {
  if (route.route) {
    console.log(`Method: ${Object.keys(route.route.methods)[0].toUpperCase()} - Path: ${route.route.path}`);
  }
});

server.use((req, res) => {
  res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ error: "Route not found" });
});

server.listen(server.get("port"), () => {
  console.log(`Server running on http://localhost:${server.get("port")}`);
});



export default server;
