import { Router } from "express";
export const indexRouter = Router();
import passport from "passport";
import usersController from "../controllers/users-controller.js";
import express from "express";
import query from "../db/query.js";

indexRouter.use(express.json()); // For JSON data
indexRouter.use(express.urlencoded({ extended: true }));

indexRouter.get("/", async (req, res) => {
  const messages = await query.getAllMessages();
  console.log(messages);
  res.render("index", { user: req.user, messages: messages });
});
indexRouter.get("/log-in", (req, res) => {
  res.render("log-in-form", { messages: req.flash("error"), user: req.user });
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
indexRouter.get("/admin", (req, res) => {
  // console.log(req.flash("adminErrorMsg"));
  res.render("admin-form", { message: req.flash("adminErrorMsg")[0] });
});
indexRouter.post("/admin", usersController.makeUserAdmin);

indexRouter.post("/new-message", async (req, res) => {
  const { message } = req.body;
  console.log(req.user);

  await query.addMessage(message, req.user.id);
  res.redirect("/");
});
