const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST register
router.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const exist = await User.findOne({ where: { email } });
    if (exist) return res.status(400).json({ msg: "Email já cadastrado" });

    const user = await User.create({ nome, email, senha });
    res.json({ msg: "Usuário cadastrado com sucesso!", user });
  } catch (err) {
    res.status(500).json({ msg: "Erro no cadastro" });
  }
});

// POST login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Busca usuário pelo EMAIL
    const user = await User.findOne({ where: { email } });

    // Se não encontrou usuário
    if (!user) {
      return res.render("home", {
        title: "Login",
        errorMsg: "Usuário não cadastrado. Deseja se registrar?",
      });
    }

    // Se senha incorreta
    if (user.senha !== senha) {
      return res.render("home", {
        title: "Login",
        errorMsg: "Senha inválida. Tente novamente.",
      });
    }

    // Se login OK -> salva na sessão
    req.session.user = {
      id: user.id,
      nome: user.nome,
      ehAdmin: user.ehAdmin,
      ehSupervisor: user.ehSupervisor,
    };

    console.log(
      "✅ Login realizado com sucesso! Redirecionando para /products"
    );

    // 🔑 Redireciona direto para lista de produtos
    return res.redirect("/products");
  } catch (err) {
    console.error("❌ Erro no login:", err);
    return res.render("home", {
      title: "Login",
      errorMsg: "Erro interno ao fazer login",
    });
  }
});

// GET logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router; // ✅ exportando o router
