const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { ensureAuthenticated } = require("../middleware/auth");

router.get("/login", (req, res) => {
  res.render("auth/login", {
    title: "Login",
    errorMsg: null,
    successMsg: null,
  });
});

router.get("/register", (req, res) => {
  res.render("auth/register", {
    title: "Cadastro",
    errorMsg: null,
    successMsg: null,
  });
});

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
      dataCadastro: new Date(),
    });

    return res.render("auth/login", {
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

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render("auth/login", {
        title: "Login",
        errorMsg: "Usuário não cadastrado. Deseja se registrar?",
      });
    }

    if (user.senha !== senha) {
      return res.render("auth/login", {
        title: "Login",
        errorMsg: "Usuário ou senha inválidos",
      });
    }

    req.session.user = {
      id: user.id,
      nome: user.nome,
      ehAdmin: user.ehAdmin,
      ehSupervisor: user.ehSupervisor,
    };

    console.log("✅ Login realizado com sucesso!");
    return res.redirect("/products");
  } catch (err) {
    console.error("Erro no login:", err);
    return res.render("auth/login", {
      title: "Login",
      errorMsg: "Erro interno ao fazer login",
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

router.get("/users", ensureAuthenticated, async (req, res) => {
  if (!req.session.user.ehAdmin) {
    return res.status(403).send("Acesso negado!");
  }

  const usuarios = await User.findAll();
  res.render("users/list", { title: "Gerenciar Usuários", usuarios });
});

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

  res.redirect("/users");
});

module.exports = router;
