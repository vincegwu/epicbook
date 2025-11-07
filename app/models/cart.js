"use strict";

module.exports = function (sequelize, DataTypes) {
  const Cart = sequelize.define(
    "Cart",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      total: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );

  Cart.associate = function (models) {
    Cart.belongsTo(models.Book, { foreignKey: "bookId" });
    Cart.hasOne(models.Checkout);
  };

  return Cart;
};
