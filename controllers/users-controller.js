import validateUser from "./validation.js";
import { validationResult } from "express-validator";
import query from "../db/query.js";
import bcrypt from "bcrypt";
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
  return { handleSignUp };
})();

export default usersController;
