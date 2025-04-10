import { validateUser, validateAdmin, validateLogin } from "./validation.js";
import { validationResult } from "express-validator";
import query from "../db/query.js";
import bcrypt, { compare } from "bcrypt";
import pool from "../db/pool.js";
import passport from "passport";
const usersController = (() => {
  const handleLogin = [
    validateLogin,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("log-in-form", {
          errors: errors.array(),
        });
      }
      passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/log-in",
        failureFlash: true,
      })(req, res, next);
    },
  ];
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
      const result = await query.addNewUser(username, email, hashedPassword);
      if (!result.success) {
        req.flash("signupError", result.message);
        return res.redirect("/sign-up");
      }
      return res.redirect("/log-in");
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
      const userId = req.user.id;
      if (passkey == "abcdef") {
        await pool.query(`UPDATE users SET isadmin = TRUE WHERE id = $1;`, [
          userId,
        ]);
        res.redirect("/");
      } else {
        req.flash("adminErrorMsg", "Wrong passkey");
        res.redirect("/admin");
      }
    },
  ];
  return { handleSignUp, makeUserAdmin, handleLogin };
})();

export default usersController;
