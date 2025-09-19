const express = require("express");
const router = express.Router();

// API de consulta de produtos (teste inicial)
router.get("/produtos", (req, res) => {
  res.json({ message: "API de produtos funcionando" });
});

module.exports = router;
