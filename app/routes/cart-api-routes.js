"use strict";

const express = require("express");
const router = express.Router();
const db = require("../models");

console.log("🔗 Cart API routes loaded");

// GET all cart items
router.get("/", async (req, res) => {
  try {
    const carts = await db.Cart.findAll({
      include: [
        {
          model: db.Book,
          include: [db.Author],
        },
      ],
    });

    res.json(carts);
  } catch (err) {
    console.error("❌ Error fetching carts:", err);
    res.status(500).json({ error: "Failed to fetch carts" });
  }
});

// POST add item to cart
router.post("/add", async (req, res) => {
  const { bookId, quantity } = req.body;

  if (!bookId) return res.status(400).json({ error: "bookId is required" });

  try {
    // Find the book
    const book = await db.Book.findByPk(bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });

    // Create a new cart
    const cartItem = await db.Cart.create({
      quantity: quantity || 1,
      price: book.price,
    });

    // Associate the book with the cart (populates Cartbook join table)
    await cartItem.addBook(book);

    // Return cart info
    res.json({ success: true, cartId: cartItem.id, bookId: book.id });
  } catch (err) {
    console.error("❌ Error adding to cart:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// DELETE all cart items (checkout)
router.delete("/delete", async (req, res) => {
  try {
    await db.Cart.destroy({ where: {}, truncate: true, cascade: true });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error clearing cart:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

module.exports = router;



