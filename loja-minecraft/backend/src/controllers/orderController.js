const pool = require("../config/db");

exports.myOrders = async (req, res) => {
  const result = await pool.query("SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC", [req.user.id]);
  res.json(result.rows);
};

exports.createOrder = async (req, res) => {
  const { product_id } = req.body;
  const product = await pool.query("SELECT * FROM products WHERE id = $1", [product_id]);
  if (!product.rows[0]) return res.status(404).json({ error: "Produto não encontrado" });

  const order = await pool.query(
    "INSERT INTO orders (user_id, product_id, amount, status) VALUES ($1, $2, $3, 'pending') RETURNING *",
    [req.user.id, product_id, product.rows[0].price]
  );

  res.status(201).json(order.rows[0]);
};
