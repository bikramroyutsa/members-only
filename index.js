import express from "express";
import dotenv from "dotenv";
import path from "path";
import url from "url";
import { indexRouter } from "./routes/index-router.js";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import pool from "./db/pool.js";
import bcrypt from "bcrypt";
dotenv.config();
const app = express();

import flash from "connect-flash";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetspath = path.join(__dirname, "public");
app.use(express.static(assetspath));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.session());
app.use(express.json()); // For JSON data
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});
app.use((req, res, next) => {
  res.status(404).render("404"); // Render the 404.ejs template
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
