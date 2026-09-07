const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  return hash;
}

async function checkPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  checkPassword
}