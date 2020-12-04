/* eslint-disable consistent-return */
const bcrypt = require("bcrypt");
const pool = require("../db");

const hashPass = async (password) => {
  return await bcrypt.hash(password, 10);
};

const updatePassword = async (req, res) => {
  const { id, password } = req.body;

  const passwordHash = await hashPass(password);
  pool.query(`UPDATE users SET password = $1 WHERE id = $2`, [passwordHash, id], (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
    return res.status(200).json({ success: true });
  });
};

module.exports = {
  updatePassword,
};
