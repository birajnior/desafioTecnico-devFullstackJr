const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const methodOverride = require("method-override");
const path = require("path");

const sequelize = require("./config/database");
const User = require("./models/User");
const Product = require("./models/Product");

sequelize.sync().then(() => {
  console.log("Banco sincronizado com sucesso!");
});

const app = express();
const expressLayouts = require("express-ejs-layouts");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

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

// passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// variáveis globais
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success_msg");
  res.locals.errorMsg = req.flash("error_msg");
  res.locals.user = req.user || null;
  next();
});

// rotas
app.use("/", require("./routes/auth"));
app.use("/products", require("./routes/products"));
app.use("/api", require("./routes/api"));

// servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
