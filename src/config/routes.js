const express = require("express");
const router = express.Router();
const passport = require("passport");
const path = require("path")

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
  "/register",
  passport.authenticate("local-signup", {
    successRedirect: "/login",
    failureRedirect: "/",
  })
);

/**
 * -------------- GET ROUTES ----------------
 */

router.get("/", (req, res, next) => {
  var accueilMsg = "Tu n'es pas connecté"
  if (req.isAuthenticated()) {
    accueilMsg = `Bonjour <u>${req.user?.username}</u> ! Tu es actuellement connecté`
  }
  res.send(
    '<h1>Home</h1><h3>' + accueilMsg + '</h3><p>Tu peux visiter ces pages:</p>' +
    '<a href="/register">register</a>' +
    '<br><a href="/login">login</a>' + 
    '<br><a href="/logout">logout</a>' +
    '<br><a href="/protected-route">ton profil</a>' +
    '<br><a href="/admin-route">page Admin</a>'
  );
});

router.get("/login", (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'front', 'pages', 'loginPage.html'));
});

router.get("/register", (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'front', 'pages', 'registerPage.html'));
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
  // res.send("Vous êtes un admin.");
  res.sendFile(path.join(__dirname, '..', 'front', 'pages', 'adminPage.html'));
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
