const pool = require("../config/db");

exports.listCoupons = async (req, res) => {
  const result = await pool.query("SELECT * FROM coupons ORDER BY id DESC");
  res.json(result.rows);
};

exports.createCoupon = async (req, res) => {
  const { code, discount } = req.body;
  const result = await pool.query(
    "INSERT INTO coupons (code, discount) VALUES ($1, $2) RETURNING *",
    [code.toUpperCase(), discount]
  );
  res.status(201).json(result.rows[0]);
};
