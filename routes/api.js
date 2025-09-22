const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");
const { ensureAuthenticated } = require("../middleware/auth");

router.use(ensureAuthenticated);

router.get("/produtos", async (req, res) => {
  try {
    const produtos = await Product.findAll({
      include: {
        model: User,
        as: "usuario",
        attributes: ["nome", "email"],
      },
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      total: produtos.length,
      produtos: produtos.map((p) => ({
        id: p.id,
        nome: p.nome,
        descricao: p.descricao,
        preco: parseFloat(p.preco),
        quantidade: p.quantidade,
        dataCriacao: p.dataCriacao,
        usuario: p.usuario
          ? { nome: p.usuario.nome, email: p.usuario.email }
          : null,
      })),
    });
  } catch (err) {
    console.error("Erro API produtos:", err);
    return res.status(500).json({
      success: false,
      message: "Erro ao carregar produtos",
    });
  }
});

module.exports = router;
