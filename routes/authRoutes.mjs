import express from "express";
import * as crypto from "node:crypto";
import dbManager from "../data/dbManager.mjs";
import HTTP_CODES from "../utils/httpCodes.mjs";

const router = express.Router();

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST)
      .json({ error: "Alle felt må fylles ut" });
  }

  try {
    const hashedPassword = hashPassword(password);
    const user = await dbManager.createUser(name, email, hashedPassword);

    if (!user) {
      return res
        .status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR)
        .json({ error: "Kunne ikke opprette bruker" });
    }
    res.status(HTTP_CODES.SUCCESS.CREATED).json(user);
  } catch (error) {
    res
      .status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST)
      .json({ error: "Alle felt må fylles ut" });
  }
  try {
    const user = await dbManager.findUserByEmail(email);

    if (!user) {
      return res
        .status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST)
        .json({ error: "Bruker ikke funnet" });
    }

    const hashedPassword = hashPassword(password);

    if (hashedPassword !== user.password) {
      return res
        .status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST)
        .json({ error: "Feil passord" });
    }

    req.session.regenerate((err) => {
      if (err) {
        return res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: "Kunne ikke opprette session" });
      }

      req.session.userId = user.id;
      req.session.username = user.name;

      req.session.save((saveErr) => {
        if (saveErr) {
          return res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: "Kunne ikke lagre session" });
        }

        res.cookie("loggedIn", "true", { httpOnly: false, path: "/" });
        res.json({
          message: "Innlogging vellykket",
          user: { id: user.id, name: user.name, email: user.email },
        });
      });
    });
  } catch (error) {
    res
      .status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
});

router.post("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: "Kunne ikke logge ut" });
      }
      res.clearCookie("connect.sid", { path: "/" });
      res.json({ message: "Du er logget ut!" });
    });
  } else {
    res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ error: "Ingen aktiv session" });
  }
});

export default router;
