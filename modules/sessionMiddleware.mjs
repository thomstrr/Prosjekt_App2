import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "secretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict"
  }
});


export default (req, res, next) => {
  console.log("Session før:", req.session);
  sessionMiddleware(req, res, () => {
    console.log("Session etter:", req.session);
    next();
  });
};

