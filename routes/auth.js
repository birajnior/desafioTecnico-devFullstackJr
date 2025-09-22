const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { ensureAuthenticated } = require("../middleware/auth");

// GET /register -> exibe formulário de cadastro
router.get("/register", (req, res) => {
  res.render("auth/register", { 
    title: "Cadastro",
    errorMsg: null,
    successMsg: null
  });
});

// POST /register
router.post("/register", async (req, res) => {
  const { nome, email, senha, confirmSenha } = req.body;
  try {
    if (senha !== confirmSenha) {
      return res.render("auth/register", {
        title: "Cadastro",
        errorMsg: "As senhas não conferem!",
      });
    }

    const exist = await User.findOne({ where: { email } });
    if (exist) {
      return res.render("auth/register", {
        title: "Cadastro",
        errorMsg: "Este e-mail já está cadastrado!",
      });
    }

    await User.create({ 
      nome, 
      email, 
      senha,
      ehAdmin: false,
      ehSupervisor: false,
      dataCadastro: new Date()
    });

    return res.render("home", {
      title: "Login",
      successMsg: "Usuário cadastrado com sucesso! Faça seu login.",
    });
  } catch (err) {
    console.error("Erro ao registrar:", err);
    res.render("auth/register", {
      title: "Cadastro",
      errorMsg: "Erro interno ao cadastrar.",
    });
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

// Rota para listar usuários (apenas Admin)
router.get("/users", ensureAuthenticated, async (req, res) => {
  if (!req.session.user.ehAdmin) {
    return res.status(403).send("Acesso negado!");
  }

  const usuarios = await User.findAll();
  res.render("users/list", { title: "Gerenciar Usuários", usuarios });
});

// Atualizar role de um usuário
router.post("/users/:id/role", ensureAuthenticated, async (req, res) => {
  if (!req.session.user.ehAdmin) {
    return res.status(403).send("Acesso negado!");
  }

  const { ehSupervisor, ehAdmin } = req.body;
  const usuario = await User.findByPk(req.params.id);

  if (!usuario) return res.status(404).send("Usuário não encontrado");

  usuario.ehSupervisor = ehSupervisor === "true";
  usuario.ehAdmin = ehAdmin === "true";
  await usuario.save();

  res.redirect("/users"); // volta pra lista de usuários
});

module.exports = router;
