const express = require("express");
const router = express.Router();
const passport = require("passport");

const { isAuth, isAdmin } = require("../utils/authMiddleware.js");

/**
 * -------------- POST ROUTES ----------------
 */

router.post(
  "/login",
  passport.authenticate("local-signin", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  })
);

router.post(
  "/register_me",
  passport.authenticate("local-signup", {
    successRedirect: "/login",
    failureRedirect: "/",
  })
);

/**
 * -------------- GET ROUTES ----------------
 */

router.get("/", (req, res, next) => {
  res.send(
    '<h1>Home</h1><p>Please <a href="/register">register</a> or <a href="/login">login</a></p>'
  );
});

router.get("/login", (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

router.get("/register", (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register_me">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

/**
 * Ici on met en place une route accessible seulement si on est authentifié
 * En passant le middleware isAuth en paramètre, on ne pourra y accéder que si l'on est pas bloqué par isAuth
 */
router.get("/protected-route", isAuth, (req, res, next) => {
  const adminMessage = req.user.admin ? "Tu es un admin" : "Tu n'es pas un admin"
  const logoutBtn = "<br><form action='/logout'><input type='submit' value='Logout'/></form>"
  const adminBtn = "<form action='/admin-route'><input type='submit' value='Admin'/></form>"
  res.send("Tu es connecté " + req.user.username + " ! " + adminMessage + logoutBtn + adminBtn);
});

/**
 * Ici on met en place une route accessible seulement si on est authentifié ET admin
 */
router.get("/admin-route", isAdmin, (req, res, next) => {
  res.send("Vous êtes un admin.");
});

/**
 * Une route pour déconnecter l'utilisateur
 */
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

/**
 * Les routes en cas de login ou d'échec
 */
router.get("/login-success", (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

module.exports = router;
