import fs from "fs";

const SESSION_FILE = "sessions.json";
let sessions = {};

let count = 0;

try {
  if (fs.existsSync(SESSION_FILE)) {
    const data = fs.readFileSync(SESSION_FILE, "utf8");
    sessions = JSON.parse(data) || {};
    console.log("Sessions loaded from file.");
  }
} catch (error) {
  console.error("Feil ved lasting av sessions:", error);
  sessions = {};
}

export async function sessionMiddleware(req, res, next) {
  if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|webmanifest)$/)) {
    return next();
  }

  let sessionId = await req.headers["x-session-id"];

  if (!sessionId && count < 3) {
    count++;
    return next();
  } else {
    count = 0;
  }

  if (sessionId && sessions[sessionId]) {
    console.log(`Eksisterende session funnet: ${sessionId}`);
  } else {
    if (req.path === "/") {
      sessionId = `session_${Date.now()}`;
      sessions[sessionId] = { views: 0 };
      console.log(`Ny session opprettet: ${sessionId}`);
    }
  }

  if (sessionId) {
    sessions[sessionId].views += 1;
    req.session = sessions[sessionId];

    res.setHeader("X-Session-ID", sessionId);

    saveSessionsToFile();
  }

  next();
}

function saveSessionsToFile() {
  try {
    fs.writeFileSync(SESSION_FILE, JSON.stringify(sessions, null, 2), "utf8");
  } catch (error) {
    console.error("Feil ved lagring av sessions:", error);
  }
}
