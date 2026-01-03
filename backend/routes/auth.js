const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDB } = require("../database/db");
require("dotenv").config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "MCKART_SECRET_KEY";

/**
 * SIGNUP
 */
router.post("/signup", async (req, res) => {
  const { name, uid, password } = req.body;
  const db = await getDB();

  if (!name || !uid || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const existingUser = await db.get("SELECT * FROM users WHERE uid = ?", [uid]);
    if (existingUser) {
      return res.status(400).json({ message: "User with this ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
      "INSERT INTO users (name, uid, password) VALUES (?, ?, ?)",
      [name, uid, hashedPassword]
    );

    const newUser = await db.get("SELECT * FROM users WHERE id = ?", [result.lastID]);

    res.status(201).json({
      message: "Signup successful",
      user: { name: newUser.name, uid: newUser.uid, role: newUser.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  const { uid, password } = req.body;
  const db = await getDB();

  if (!uid || !password) {
    return res.status(400).json({ message: "UID and password required" });
  }

  try {
    const user = await db.get("SELECT * FROM users WHERE uid = ?", [uid]);
    if (!user) {
      return res.status(401).json({ message: "Invalid UID or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid UID or password" });
    }

    const token = jwt.sign(
      { uid: user.uid, name: user.name, role: user.role },
      SECRET_KEY,
      { expiresIn: "6h" }
    );

    res.json({
      message: "Login successful",
      user: { name: user.name, uid: user.uid, role: user.role },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * SWITCH ROLE
 */
router.post("/switch-role", async (req, res) => {
  const { uid, role } = req.body;
  const db = await getDB();

  if (!uid || !role) {
    return res.status(400).json({ message: "UID and role required" });
  }

  if (!["buyer", "seller"].includes(role)) {
    return res.status(400).json({ message: "Role must be 'buyer' or 'seller'" });
  }

  try {
    await db.run("UPDATE users SET role = ? WHERE uid = ?", [role, uid]);
    res.json({ message: "Role updated", role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
