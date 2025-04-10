import { body } from "express-validator";

const validateUser = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .matches(/^[a-zA-Z]+[a-zA-Z0-9]*$/)
    .withMessage(
      "Username must start with a letter and can contain letters and numbers."
    ),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage(`Email must be a valid email`),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

];

const validateLogin = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long")
    .matches(/^[a-zA-Z]+[a-zA-Z0-9]*$/)
    .withMessage(
      "Username must start with a letter and can contain letters and numbers."
    ),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

];
const validateAdmin = [
  body("passkey")
  .trim()
  .notEmpty()
  .withMessage("Enter the passkey")
]
export {validateAdmin, validateUser, validateLogin}