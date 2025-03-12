import express from "express";
import * as crypto from "node:crypto";
import connectionPool from "../data/database.mjs";
import HTTP_CODES from "../utils/httpCodes.mjs";

const router = express.Router();

function hashPassword(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
}

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ error: "Alle felt må fylles ut" });
    }

    try {
        const hashedPassword = hashPassword(password);
        const result = await connectionPool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, hashedPassword]
        );
        res.status(HTTP_CODES.SUCCESS.CREATED).json(result.rows[0]);
    } catch (error) {
        res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ error: "Alle felt må fylles ut" });
    }

    try {
        const result = await connectionPool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) {
            return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ error: "Bruker ikke funnet" });
        }

        const user = result.rows[0];
        const hashedPassword = hashPassword(password);

        if (hashedPassword !== user.password) {
            return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).json({ error: "Feil passord" });
        }

        if (!req.session) {
            return res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: "Session ikke tilgjengelig" });
        }

        req.session.userId = user.id;
        res.json({ message: "Innlogging vellykket", user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
});

export default router;
