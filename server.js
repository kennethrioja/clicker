// server.js
require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Ensure the table exists
pool.query(
  `CREATE TABLE IF NOT EXISTS my_table (name TEXT PRIMARY KEY, count INT DEFAULT 0);`
).catch(console.error);

// GET - Serve HTML form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// POST - Update click count
app.post("/count", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO my_table (name, count) VALUES ($1, 1)
      ON CONFLICT (name) DO UPDATE SET count = my_table.count + 1 RETURNING count;`,
      [name]
    );
    const count = result.rows[0].count;
    res.json({ name, count });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
