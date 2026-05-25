const pool = require("../config/db");

exports.getSettings = async (req, res) => {
  const result = await pool.query("SELECT * FROM settings WHERE id = 1");
  res.json(result.rows[0]);
};

exports.updateSettings = async (req, res) => {
  const { store_name, server_ip, server_port, maintenance } = req.body;
  const result = await pool.query(
    "UPDATE settings SET store_name=$1, server_ip=$2, server_port=$3, maintenance=$4 WHERE id=1 RETURNING *",
    [store_name, server_ip, server_port, maintenance]
  );
  res.json(result.rows[0]);
};
