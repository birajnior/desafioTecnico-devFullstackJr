const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const methodOverride = require("method-override");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

// Cria app após imports
const app = express();
// --- Livereload ---
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "views"));
liveReloadServer.watch(path.join(__dirname, "public"));

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

app.use(connectLivereload()); // Middleware precisa do app já criado

// --- Banco ---
const sequelize = require("./config/database");
const User = require("./models/User");
const Product = require("./models/Product");

sequelize.sync().then(() => {
  console.log("Banco sincronizado com sucesso!");
});

// --- EJS + Layouts ---
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

// --- Middlewares ---
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "logsUpSecretKey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// --- Variáveis globais ---
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success_msg")[0] || null;
  res.locals.errorMsg = req.flash("error_msg")[0] || null;
  res.locals.user = req.user || null;
  next();
});

app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

// --- Rotas ---
app.use("/", require("./routes/auth"));
app.use("/products", require("./routes/products"));
app.use("/api", require("./routes/api"));

// --- Servidor ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
