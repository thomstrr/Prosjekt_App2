import express from "express";
import { getAllItems, getItemById, createItem, updateItem, deleteItem  } from "../data/dataController.mjs";

const router = express.Router();

router.get("/", getAllItems);
router.get("/:id", getItemById);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;

