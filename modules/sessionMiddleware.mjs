import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === "production", // Kun secure i produksjon
    httpOnly: true, // Sikrer at JavaScript ikke kan lese cookies
    sameSite: "lax" // Hindrer problemer med CORS
  }
});

// 📌 Logg sessions for å sjekke om de eksisterer
export default (req, res, next) => {
  console.log("🔥 Session før:", req.session);
  sessionMiddleware(req, res, () => {
    console.log("✅ Session etter:", req.session);
    next();
  });
};

