const pool = require("../config/db");

exports.dashboard = async (req, res) => {
  const sales = await pool.query("SELECT COALESCE(SUM(amount), 0) AS total FROM orders WHERE status = 'paid'");
  const orders = await pool.query("SELECT COUNT(*) AS total FROM orders");
  const users = await pool.query("SELECT COUNT(*) AS total FROM users");
  const top = await pool.query("SELECT minecraft_nick, discord_nick, total_spent FROM users ORDER BY total_spent DESC LIMIT 10");

  res.json({
    totalSales: sales.rows[0].total,
    totalOrders: orders.rows[0].total,
    totalUsers: users.rows[0].total,
    topBuyers: top.rows
  });
};
