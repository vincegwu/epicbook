"use strict";

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectModule: require("mysql2"),
    dialectOptions: {
      ssl: {
        require: true
      }
    },
    logging: console.log
  }
);

module.exports = sequelize;
