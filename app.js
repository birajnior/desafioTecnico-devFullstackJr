const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

// Cria app
const app = express();

// --- Banco ---
const sequelize = require("./config/database");
const User = require("./models/User");
const Product = require("./models/Product");

// 🔑 Função para garantir que o Admin existe
async function ensureAdmin() {
  try {
    const admin = await User.findOne({ where: { email: "admin@logsup.com" } });
    if (!admin) {
      await User.create({
        nome: "admin",
        email: "admin@logsup.com",
        senha: "admin#123", // ⚠️ simples (plaintext), mas OK pra teste
        ehAdmin: true,
        ehSupervisor: false,
        dataCadastro: new Date(),
      });
      console.log("✅ Usuário admin criado: admin@logsup.com / admin#123");
    } else {
      console.log("✅ Admin já existe no banco");
    }
  } catch (error) {
    console.error("❌ Erro ao criar admin:", error);
  }
}

// Sincronizar BD
sequelize.sync().then(() => {
  console.log("✅ Banco sincronizado com sucesso!");
  ensureAdmin(); // 🔑 Aqui garantimos a criação do Admin
});

// --- EJS + Layouts ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "logsUpSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 24 hrs
    },
  })
);

// --- Variáveis globais ---
app.use((req, res, next) => {
  res.locals.successMsg = null;
  res.locals.errorMsg = null;
  res.locals.user = req.session.user || null;
  next();
});

// --- Rota Home ---
app.get("/", (req, res) => {
  if (req.session.user) {
    return res.redirect("/products");
  }
  res.render("home", { title: "Home" });
});

// --- Rotas ---
app.use("/", require("./routes/auth"));
app.use("/products", require("./routes/products"));
app.use("/api", require("./routes/api"));

// --- Erros 404 ---
app.use((req, res) => {
  res.status(404).send("Página não encontrada (404)");
});

// --- Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
