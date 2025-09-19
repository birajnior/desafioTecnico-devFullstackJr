const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Product = sequelize.define("Product", {
  nome: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.TEXT },
  preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  quantidade: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  dataCriacao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

Product.belongsTo(User, { foreignKey: "userId" });

module.exports = Product;
