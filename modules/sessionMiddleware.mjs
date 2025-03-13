import session from "express-session";
import pg from "pg";
import pgSession from "connect-pg-simple";
import dotenv from "dotenv";

dotenv.config();

const pgPool = new pg.Pool({
  connectionString: process.env.DB_CREDENTIALS,
  ssl: {
    rejectUnauthorized: false
  },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pgPool.connect()
  .then(client => {
    console.log("Tilkoblet til PostgreSQL for sessions!");
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
  if (req.method !== "OPTIONS" && req.url !== "/sw.js" && req.url !== "/favicon.ico") {
    console.log(`Middleware triggered for: ${req.method} ${req.url}`);
    console.log("Session før:", req.session);
    console.log("Session ID:", req.sessionID);
  }

  sessionMiddleware(req, res, (error) => {
    if (error) {
      console.error("Session Middleware Error:", error);
      return res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERRO).send("Session error");
    }

    if (req.method !== "OPTIONS" && req.url !== "/sw.js" && req.url !== "/favicon.ico") {
      console.log("Session etter:", req.session);
      console.log("Session ID etter:", req.sessionID);
    }
    next();
  });
};

