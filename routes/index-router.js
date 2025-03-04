import { Router } from "express";
export const indexRouter = Router();
import passport from "passport";
import usersController from "../controllers/users-controller.js";

indexRouter.get("/", (req, res) => {
  res.render("index", { user: req.user });
});
indexRouter.get("/log-in", (req, res) => {
  res.render("log-in-form", { messages: req.flash("error") });
});
indexRouter.get("/sign-up", (req, res) => res.render("sign-up-form"));

indexRouter.post("/sign-up", usersController.handleSignUp);
indexRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureFlash: true,
  })
);
indexRouter.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
