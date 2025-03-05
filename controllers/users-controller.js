import { validateUser, validateAdmin } from "./validation.js";
import { validationResult } from "express-validator";
import query from "../db/query.js";
import bcrypt from "bcrypt";
import pool from "../db/pool.js";
const usersController = (() => {
  const handleSignUp = [
    validateUser,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("sign-up-form", {
          errors: errors.array(),
        });
      }
      const { username, password, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await query.addNewUser(username, email, hashedPassword);
      res.redirect("/");
    },
  ];
  const makeUserAdmin = [
    validateAdmin,
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      }
      const { passkey } = req.body;
      // console.log(req.user)
      const userId = req.user.id;
      if (passkey == "abcdef") {
        await pool.query(`UPDATE users SET isadmin = TRUE WHERE id = $1;`, [
          userId,
        ]);
        res.redirect("/");
      }
      else{
        req.flash('adminErrorMsg', 'Wrong passkey')
        res.redirect("/admin")
      }
    },
  ];
  return { handleSignUp, makeUserAdmin };
})();

export default usersController;
