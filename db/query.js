import pool from "./pool.js";

const query = (() => {
  async function addNewUser(username, email, password) {
    const isAdmin = 'FALSE';
    await pool.query(
      `
      INSERT INTO users (username, email, password, isadmin) 
      VALUES ($1, $2, $3, $4)`,
      [username, email, password, isAdmin]
    );
  }

  return { addNewUser };
})();

export default query;
