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
  async function getUsernameById(id) {
    const { rows } = await pool.query(
      `
      SELECT username FROM users WHERE id = $1
      `,
      [id]
    );
    return rows[0].username;
  }
  async function getAllMessages() {
    const { rows } = await pool.query(`SELECT * FROM messages`);

    const messagesWithUsernames = await Promise.all(
      rows.map(async (message) => {
        const user_id = message.user_id;
        const username = await getUsernameById(user_id);
        return { ...message, created_by: username }; // Create a new object with created_by
      })
    );

    return messagesWithUsernames;
  }
  async function deleteMessage(id) {
    await pool.query(
      `
      DELETE FROM messages WHERE id = $1
      `,
      [id]
    );
  }
  return { addNewUser, addMessage, getAllMessages, deleteMessage };
})();

export default query;
