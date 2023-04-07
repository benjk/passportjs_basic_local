const express = require("express");
const router = express.Router();
const passport = require("passport");

const { isAuth, isAdmin } = require("../utils/authMiddleware.js");
const { createUser } = require("../models/user.controller.js");


/**
 * -------------- POST ROUTES ----------------
 */

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  })
);

router.post("/register", (req, res, next) => {
  if (createUser(req.body.username, req.body.password)){
    res.redirect("/login");
  }

});

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
    '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

/**
 * Ici on met en place une route accessible seulement si on est authentifié
 */
router.get("/protected-route", isAuth, (req, res, next) => {
  res.send("Vous êtes connecté.");
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
    res.redirect("/protected-route");
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
