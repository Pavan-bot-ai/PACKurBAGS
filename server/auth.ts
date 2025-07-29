import { Router } from "express";
import { pool } from "./db"; // adjust if you're using another name

const router = Router();

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]);
    if (result.rows.length > 0) {
      res.json({ message: "Login successful", user: result.rows[0] });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const insert = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, password]
    );
    res.status(201).json({ message: "User registered", user: insert.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
