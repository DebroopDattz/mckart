const express = require("express");
const { getDB } = require("../database/db");
const router = express.Router();

// ===== Send message =====
router.post("/send", async (req, res) => {
  const { itemId, itemName, buyerName, message, sender = "buyer" } = req.body;

  if (!itemId || !message)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const db = await getDB();
    await db.run(
      `INSERT INTO chats (itemId, itemName, buyerName, sender, message) VALUES (?, ?, ?, ?, ?)`,
      [itemId, itemName, buyerName, sender, message]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

// ===== Get messages for an item =====
router.get("/:itemId", async (req, res) => {
  const { itemId } = req.params;
  try {
    const db = await getDB();
    const messages = await db.all("SELECT * FROM chats WHERE itemId = ? ORDER BY timestamp ASC", [itemId]);
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// ===== Get all chats for seller =====
// Group by itemId + buyerName to show unique conversations
router.get("/seller-chats", async (req, res) => {
  try {
    const db = await getDB();
    // Getting distinct conversations
    const chats = await db.all(`
      SELECT DISTINCT itemId, itemName, buyerName 
      FROM chats
    `);
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// ===== Get all chats for buyer =====
router.get("/buyer-chats/:buyerName", async (req, res) => {
  const { buyerName } = req.params;
  try {
    const db = await getDB();
    const chats = await db.all(`
      SELECT DISTINCT itemId, itemName, buyerName 
      FROM chats 
      WHERE buyerName = ?
    `, [buyerName]);
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

module.exports = router;
