const pool = require("../config/db");

exports.listProducts = async (req, res) => {
  const result = await pool.query("SELECT * FROM products ORDER BY id DESC");
  res.json(result.rows);
};

exports.createProduct = async (req, res) => {
  const { name, description, image, price, category } = req.body;
  const result = await pool.query(
    "INSERT INTO products (name, description, image, price, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, description, image, price, category]
  );
  res.status(201).json(result.rows[0]);
};

exports.deleteProduct = async (req, res) => {
  await pool.query("DELETE FROM products WHERE id = $1", [req.params.id]);
  res.json({ message: "Produto removido" });
};
