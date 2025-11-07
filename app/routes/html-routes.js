"use strict";

require("dotenv").config();
const express = require("express");
const router = express.Router();
const db = require("../models");
const accounting = require("accounting");
const lodash = require("lodash");

// Helper: Format books for rendering
function formatBooks(books) {
  return books.map((book) => {
    if (!book.dataValues) return book;
    const dataValues = book.dataValues;
    dataValues.price = accounting.formatMoney(dataValues.price || 0);
    dataValues.modalId = `modal-book-${dataValues.id}`;
    dataValues.modalhref = `#modal-book-${dataValues.id}`;
    return book;
  });
}

// ---------------------- INDEX PAGE ----------------------
router.get("/", async (req, res) => {
  try {
    const allBooks = await db.Book.findAll({ limit: 9, include: [db.Author] });
    const distinctCategory = await db.Book.findAll({
      attributes: [[db.sequelize.fn("DISTINCT", db.sequelize.col("genre")), "genre"]],
    });
    const cartCount = await db.Cart.count();

    res.render("index", {
      books: formatBooks(allBooks),
      categories: distinctCategory,
      cartCount,
    });
  } catch (err) {
    console.error("❌ Error in GET / route:", err);
    res.status(500).send("Server Error — " + err.message);
  }
});

// ---------------------- GALLERY PAGE ----------------------
router.get("/gallery", async (req, res) => {
  try {
    const books = await db.Book.findAll({ include: [db.Author] });
    const cartCount = await db.Cart.count();

    res.render("gallery", {
      books: formatBooks(books),
      cartCount,
    });
  } catch (err) {
    console.error("❌ Error in GET /gallery:", err);
    res.status(500).send("Server Error — " + err.message);
  }
});

// ---------------------- CATEGORY PAGE ----------------------
router.get("/category/:genre", async (req, res) => {
  try {
    const genre = req.params.genre;
    const books = await db.Book.findAll({ where: { genre }, include: [db.Author] });
    const cartCount = await db.Cart.count();

    res.render("category", {
      books: formatBooks(books),
      genre,
      cartCount,
    });
  } catch (err) {
    console.error(`❌ Error fetching category ${req.params.genre}:`, err);
    res.status(500).send("Server Error — " + err.message);
  }
});

// ---------------------- CART PAGE ----------------------
router.get("/cart", async (req, res) => {
  try {
    // Fetch cart items with associated books
    const cartItems = await db.Cart.findAll({
      include: [{ model: db.Book, include: [db.Author] }],
    });

    // Compute subtotal
    const subTotal = cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    res.render("cart", {
      cart: cartItems,
      cartCount: cartItems.length,
      subTotal: accounting.formatMoney(subTotal),
    });
  } catch (err) {
    console.error("❌ Error fetching cart:", err);
    res.status(500).send("Server Error — " + err.message);
  }
});

// ---------------------- SINGLE BOOK PAGE ----------------------
router.get("/book/:id", async (req, res) => {
  try {
    const book = await db.Book.findByPk(req.params.id, { include: [db.Author] });
    const cartCount = await db.Cart.count();

    if (!book) return res.status(404).send("Book not found");

    res.render("book", {
      book: formatBooks([book])[0],
      cartCount,
    });
  } catch (err) {
    console.error("❌ Error fetching single book:", err);
    res.status(500).send("Server Error — " + err.message);
  }
});

module.exports = router;





