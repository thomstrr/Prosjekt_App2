import express from "express";

const router = express.Router();

//Dummy data for treet
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
  res.json(treeData);
});

//POST
router.post("/", (req, res) => {
  const { parentName, name } = req.body;

  function findNode(node, parentName) {
    if (node.name === parentName) return node;
    for (let child of node.children) {
      let found = findNode(child, parentName);
      if (found) return found;
    }
    return null;
  }

  let parent = findNode(treeData, parentName);

  if (parent) {
    parent.children.push({ name, children: [] });
    res.status(201).json({ message: "Node added", tree: treeData });
  } else {
    res.status(404).json({ error: "Parent not found" });
  }
});

//PUT
router.put("/:name", (req, res) => {
  const { name } = req.params;
  const { newName } = req.body;

  function updateNode(node, name) {
    if (node.name === name) {
      node.name = newName;
      return true;
    }
    return node.children.some((child) => updateNode(child, name));
  }

  if (updateNode(treeData, name)) {
    res.json({ message: "Node updated", tree: treeData });
  } else {
    res.status(404).json({ error: "Node not found" });
  }
});

//DELETE
router.delete("/:name", (req, res) => {
  const { name } = req.params;

  function deleteNode(node, name) {
    node.children = node.children.filter((child) => child.name !== name);
    node.children.forEach((child) => deleteNode(child, name));
  }

  deleteNode(treeData, name);
  res.json({ message: "Node deleted", tree: treeData });
});

export default router;
