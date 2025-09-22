const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { ensureAuthenticated, ensureSupervisor } = require("../middleware/auth");

router.use(ensureAuthenticated);

// Lista de produtos
router.get("/", async (req, res) => {
  try {
    const produtos = await Product.findAll({
      include: [
        {
          model: require("../models/User"),
          as: "User", // ou o alias que você definiu no relacionamento
          attributes: ["nome", "email"], // só nome e email do usuário
        },
      ],
      order: [["createdAt", "DESC"]], // mais recentes primeiro
    });

    res.render("products/list", {
      title: "Lista de Produtos",
      produtos,
      user: req.session.user, // ✅ passa usuário logado para a view
    });
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    res.render("products/list", {
      title: "Lista de Produtos",
      produtos: [],
      errorMsg: "Erro ao carregar produtos",
      user: req.session.user,
    });
  }
});

// Novo produto
router.get("/new", (req, res) => {
  res.render("products/new", {
    title: "Cadastrar Produto",
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
      userId: req.session.user.id,
      dataCriacao: new Date(),
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

// Editar produto
router.get("/:id/edit", ensureAuthenticated, async (req, res) => {
  if (!(req.session.user.ehAdmin || req.session.user.ehSupervisor)) {
    return res
      .status(403)
      .send("Acesso negado: apenas Admin ou Supervisor podem editar produtos.");
  }
  const product = await Product.findByPk(req.params.id);
  res.render("products/edit", { product });
});

// --- DELETE /products/:id ---
router.delete("/:id", ensureSupervisor, async (req, res) => {
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
router.put("/:id", ensureSupervisor, async (req, res) => {
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
