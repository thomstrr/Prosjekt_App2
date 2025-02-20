import express from "express";
import HTTP_CODES from "../utils/httpCodes.mjs";

const router = express.Router();

//Dummy data for tre
let treeData = {
  name: "Root",
  children: [
    {
      name: "Category A",
      children: [{ name: "Subcategory A1", children: [] }],
    },
    {
      name: "Category B",
      children: [{ name: "Subcategory B1", children: [] }],
    },
  ],
};

//GET
router.get("/", (req, res) => {
  res.status(HTTP_CODES.SUCCESS.OK).send(treeData);
});

//POST
router.post("/", (req, res) => {
  const { parentName, name } = req.body;
  const parent = findNode(treeData, parentName);

  if (!parent) {
    return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND)
              .send({ error: "Parent not found" });
  }

  parent.children.push({ name, children: [] });

  res.status(HTTP_CODES.SUCCESS.CREATED)
     .send({ message: "Node created", tree: treeData });
});

//PUT
router.put("/:name", (req, res) => {
  const { name } = req.params;
  const { newName } = req.body;

  if (!updateNode(treeData, name, newName)) {
    return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND)
              .send({ error: "Node not found" });
  }

  res.status(HTTP_CODES.SUCCESS.OK)
     .send({ message: "Node updated", tree: treeData });
});

//DELETE
router.delete("/:name", (req, res) => {
  if (!deleteNode(treeData, req.params.name)) {
    return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND)
              .send({ error: "Node not found" });
  }

  res.status(HTTP_CODES.SUCCESS.OK)
     .send({ message: "Node deleted", tree: treeData });
});

//Functions--------------------------------------------------

function findNode(node, parentName) {
  if (node.name === parentName) return node;

  for (const child of node.children) {
    const found = findNode(child, parentName);
    if (found) return found;
  }

  return null;
}

function updateNode(node, name, newName) {
  if (node.name === name) {
    node.name = newName;
    return true;
  }

  for (const child of node.children) {
    if (updateNode(child, name, newName)) {
      return true;
    }
  }
  return false;
};

function deleteNode(node, name) {
  if (node.name === name) return false;

  for (let i = node.children.length - 1; i >= 0; i--) {
    if (node.children[i].name === name) {
      node.children.splice(i, 1);
      return true; 
    } else if (deleteNode(node.children[i], name)) {
      return true; 
    }
  }
  return false; 
};


export default router;
