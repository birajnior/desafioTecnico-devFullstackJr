const express = require("express");
const router = express.Router();

// Rota de listagem de produtos (teste inicial)
router.get("/", (req, res) => {
  res.send("Página de produtos");
});

module.exports = router;
