import dbManager from "./dbManager.mjs";
import HTTP_CODES from "../utils/httpCodes.mjs";



export async function getAllItems(req, res) {
    const result = await dbManager.read("SELECT * FROM items");
    if (!result) return res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: "Feil ved henting av data" });
    res.json(result);
}

export async function getItemById(req, res) {
    const result = await dbManager.read("SELECT * FROM items WHERE id = $1", req.params.id);
    if (!result || result.length === 0) return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ message: "Item ikke funnet" });
    res.json(result[0]);
};

export async function createItem(req, res) {
    const { name, description } = req.body;
    const result = await dbManager.create(
        "INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *",
        name, description
    );
    if (!result) return res.status(HTTP_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR).json({ error: "Feil ved opprettelse" });
    res.status(HTTP_CODES.SUCCESS.CREATED).json(result[0]);
};

export async function updateItem(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;
    const result = await dbManager.update(
        "UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *",
        name, description, id
    );
    if (!result || result.length === 0) return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ message: "Item ikke funnet" });
    res.json(result[0]);
};

export async function deleteItem(req, res) {
    const result = await dbManager.purge("DELETE FROM items WHERE id = $1 RETURNING *", req.params.id);
    if (!result || result.length === 0) return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ message: "Item ikke funnet" });
    res.json({ message: "Item slettet" });
}
