import fs from 'fs';

const SESSION_FILE = "sessions.json";
let sessions = {};


try {
    const data = fs.readFileSync(SESSION_FILE, "utf8");
    sessions = JSON.parse(data);
    console.log("Sessions loaded from file:", sessions);
} catch (error) {
    console.log("Ingen sessions.json funnet, starter med tomt objekt.");
    sessions = {};
}


export function sessionMiddleware(req, res, next) {
    const sessionId = req.headers["x-session-id"] || `session_${Date.now()}`;

    if (!sessions[sessionId]) {
        sessions[sessionId] = { views: 0 };
    }

    console.log(`Session ID: ${sessionId}, Current views: ${sessions[sessionId].views}`);


    sessions[sessionId].views += 1;

    console.log("Updated sessions:", sessions);

    fs.writeFileSync(SESSION_FILE, JSON.stringify(sessions, null, 2), "utf8");

    req.session = sessions[sessionId]; 
    res.setHeader("X-Session-ID", sessionId); 

    next();
    
}

