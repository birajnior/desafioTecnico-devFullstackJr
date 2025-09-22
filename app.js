const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const app = express();

const sequelize = require("./config/database");
const User = require("./models/User");
const Product = require("./models/Product");

async function ensureAdmin() {
  try {
    const admin = await User.findOne({ where: { email: "admin@logsup.com" } });
    if (!admin) {
      await User.create({
        nome: "admin",
        email: "admin@logsup.com",
        senha: "admin#123",
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

sequelize.sync().then(() => {
  console.log("✅ Banco sincronizado com sucesso!");
  ensureAdmin();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

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
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use((req, res, next) => {
  res.locals.successMsg = null;
  res.locals.errorMsg = null;
  res.locals.user = req.session.user || null;
  next();
});

app.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.render("products/list", {
      produtos: [],
      user: null,
      title: "Produtos",
    });
  }
  const produtos = await Product.findAll();
  return res.render("products/list", {
    produtos,
    user: req.session.user,
    title: "Produtos",
  });
});
app.use("/", require("./routes/auth"));
app.use("/products", require("./routes/products"));
app.use("/api", require("./routes/api"));

app.use((req, res) => {
  res.status(404).send("Página não encontrada (404)");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
