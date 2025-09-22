const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Lista de produtos
router.get("/", async (req, res) => {
  try {
    const produtos = await Product.findAll();

    res.render("products/list", {
      title: "Lista de Produtos",
      produtos, // envia para o EJS
    });
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    res.render("products/list", {
      title: "Lista de Produtos",
      produtos: [],
      errorMsg: "Erro ao carregar produtos",
    });
  }
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

router.post("/", async (req, res) => {
  try {
    const { nome, descricao, preco, quantidade } = req.body;

    if (!nome || !preco) {
      return res.status(400).json({
        success: false,
        message: "Nome e preço são obrigatórios!",
      });
    }

    // Criar no banco
    const novoProduto = await Product.create({
      nome,
      descricao,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade),
    });

    console.log("Produto salvo:", novoProduto.toJSON());

    return res.status(201).json({
      success: true,
      message: "Produto adicionado com sucesso!",
      produto: novoProduto,
    });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno ao criar produto",
    });
  }
});

// --- DELETE /products/:id ---
// DELETE /products/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado",
      });
    }

    return res.json({
      success: true,
      message: "Produto excluído com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno ao excluir produto",
    });
  }
});

// GET /products/:id → retorna JSON de 1 produto
router.get("/:id", async (req, res) => {
  try {
    console.log(req.params);

    const produto = await Product.findByPk(req.params.id);

    if (!produto) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado",
      });
    }

    res.json({
      success: true,
      produto,
    });
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno ao buscar produto",
    });
  }
});

// PUT /products/:id
router.put("/:id", async (req, res) => {
  try {
    const { descricao, preco, quantidade } = req.body;

    const produto = await Product.findByPk(req.params.id);
    if (!produto) {
      return res.status(404).json({
        success: false,
        message: "Produto não encontrado",
      });
    }

    produto.descricao = descricao;
    produto.preco = preco;
    produto.quantidade = quantidade;

    await produto.save();

    res.json({
      success: true,
      message: "Produto atualizado com sucesso!",
      produto,
    });
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno ao atualizar produto",
    });
  }
});
module.exports = router;
