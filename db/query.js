import pool from "./pool.js";

const query = (() => {
  async function addNewUser(username, email, password) {
    const isAdmin = "FALSE";
    await pool.query(
      `
      INSERT INTO users (username, email, password, isadmin) 
      VALUES ($1, $2, $3, $4)`,
      [username, email, password, isAdmin]
    );
  }
  async function addMessage(message, user_id) {
    await pool.query(
      `
      INSERT INTO messages (user_id, message) VALUES ($1, $2)
      `,
      [user_id, message]
    );
  }
  async function getAllMessages() {
    const { rows } = await pool.query(`
      SELECT * FROM messages
      `);
    return rows;
  }
  return { addNewUser, addMessage, getAllMessages };
})();

export default query;
