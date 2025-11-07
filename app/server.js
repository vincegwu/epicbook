"use strict";

require("dotenv").config();

const express = require("express");
const exphbs = require("express-handlebars");
const sequelize = require("./config/database"); // Sequelize instance
const db = require("./models"); // Sequelize models

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handlebars setup
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
const cartRoutes = require("./routes/cart-api-routes");
const htmlRoutes = require("./routes/html-routes");
app.use("/api/cart", cartRoutes);
app.use("/", htmlRoutes);

// Sync DB and start server
console.log("🔗 Connecting to database...");
sequelize
  .sync()
  .then(() => {
    console.log("✅ Database synced successfully");
    app.listen(PORT, () => {
      console.log(`🌍 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database sync failed:", err);
  });

