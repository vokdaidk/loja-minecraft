const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
  try {
    const { email, minecraft_nick, discord_nick, password } = req.body;
    if (!email || !minecraft_nick || !discord_nick || !password) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, minecraft_nick, discord_nick, password) VALUES ($1, $2, $3, $4) RETURNING id, email, minecraft_nick, discord_nick",
      [email.toLowerCase(), minecraft_nick, discord_nick, hashedPassword]
    );

    const user = result.rows[0];
    res.status(201).json({ user, token: generateToken(user) });
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "Email já cadastrado" });
    res.status(500).json({ error: "Erro ao registrar" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    delete user.password;
    res.json({ user, token: generateToken(user) });
  } catch {
    res.status(500).json({ error: "Erro ao logar" });
  }
};
