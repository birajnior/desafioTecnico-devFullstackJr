const express = require("express");
const router = express.Router();

// Lista de produtos
router.get("/", (req, res) => {
  res.render("products/list", {
    title: "Lista de Produtos",
    produtos: [], // depois vamos puxar do banco
  });
});

// Novo produto
router.get("/new", (req, res) => {
  res.render("products/new", {
    title: "Cadastrar Produto",
  });
});

// Editar produto
router.get("/:id/edit", (req, res) => {
  res.render("products/edit", {
    title: "Editar Produto",
    produto: { id: req.params.id },
  });
});

module.exports = router;
