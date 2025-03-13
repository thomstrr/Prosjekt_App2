import session from "express-session";
import pg from "pg";
import pgSession from "connect-pg-simple";
import dotenv from "dotenv";

dotenv.config();

const pgPool = new pg.Pool({
  connectionString: process.env.DB_CREDENTIALS,
  ssl: { rejectUnauthorized: false },
  max: 3, 
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000,
});

pgPool.connect()
  .then(client => {
    client.release();
  })
  .catch(error => console.error("Feil ved tilkobling til PostgreSQL:", error));

const sessionStore = new (pgSession(session))({
  pool: pgPool,
  tableName: "session",
});

sessionStore.on("error", (error) => {
  console.error("Database session error:", error);
});

const sessionMiddleware = session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || "secretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: "Lax",
  },
});

export default (req, res, next) => {
  const ignoredLogs = ["/favicon.ico", "/sw.js", "/manifest.webmanifest"];
  const ignoredExtensions = [".css", ".js", ".png", ".jpg", ".jpeg", ".svg"];

  if (!ignoredLogs.includes(req.url) && !ignoredExtensions.some(ext => req.url.endsWith(ext))) {
    console.log(`Middleware triggered for: ${req.method} ${req.url}`);
    console.log("Mottatt session-cookie:", req.headers.cookie ? req.headers.cookie : "Ingen session-cookie");
  }


  sessionMiddleware(req, res, (error) => {
    if (error) {
      return res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).send("Session error");
    }
    next();
  });
};
