const sequelize = require("./config/database");
const Product = require("./models/Product");

async function seed() {
  try {
    await sequelize.sync();

    await Product.bulkCreate([
      {
        nome: "Bola de Futebol",
        descricao: "Bola oficial tamanho 5",
        preco: 120.0,
        quantidade: 50,
        userId: 1,
      },
      {
        nome: "Camisa de Treino",
        descricao: "Camisa Dry-Fit esportiva",
        preco: 89.9,
        quantidade: 200,
        userId: 1,
      },
      {
        nome: "Raquete de Tênis",
        descricao: "Raquete profissional de tênis",
        preco: 450.0,
        quantidade: 30,
        userId: 1,
      },
      {
        nome: "Tênis de Corrida",
        descricao: "Tênis leve para maratonas",
        preco: 379.99,
        quantidade: 100,
        userId: 1,
      },
      {
        nome: "Barra de Proteína",
        descricao: "Suplemento nutricional esportivo",
        preco: 12.5,
        quantidade: 500,
        userId: 1,
      },
    ]);

    console.log("✅ Produtos esportivos inseridos com sucesso!");
    process.exit();
  } catch (err) {
    console.error("Erro ao inserir produtos:", err);
    process.exit(1);
  }
}

seed();
