const express = require("express");
const router = express.Router();

router.get("/new", (req, res) => {
  res.render("products/new", { title: "Cadastrar Produto" });
});

module.exports = router;
