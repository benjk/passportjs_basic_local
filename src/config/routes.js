const express = require("express")
const router = express.Router()
const passport = require("passport")
const path = require("path")
const { checkSchema, validationResult } = require('express-validator')

const { isAuth, isAdmin } = require("../utils/authMiddleware.js")
const { getProfilePageData } = require("../utils/messageBuilder.js")
const msg = require ('./data.json').messages

/**
 * -------------- POST ROUTES ----------------
 */

const { registrationSchema, loginSchema } = require('./validators.js')

router.post(
  "/login",
  checkSchema(loginSchema),
  (req, res, next) => {
    // Validate incoming input
    const errors = validationResult(req)

    // S'il y a des erreurs on aliment les flash messages et on redirige
    if (!errors.isEmpty()) {
      for (const err of errors.array()){
        req.flash('error', err.msg)
      }

      res.redirect('/login')
    } else {
      // Si pas d'erreur on lance le next middleware = signup avec passport
      next()
    }
  },
  passport.authenticate("local-signin", {
    failureRedirect: "/login",
    successRedirect: "/login-success",
    failureFlash: true,
  })
);

router.post(
  "/register",
  checkSchema(registrationSchema),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      for (const err of errors.array()){
        req.flash('error', err.msg)
      }

      res.redirect('/register')
    } else {
      // Si pas d'erreur on lance le next middleware = signup avec passport
      next()
    }
  },
  passport.authenticate("local-signup", {
    failureRedirect: "/register",
    failureFlash: true,    
  }),
  (req,res) => {
    req.flash("success", msg.passport.successSignIn);
    req.flash("user", req.user?.username);
    res.redirect("/login");
 });

/**
 * -------------- GET ROUTES ----------------
 */

router.get("/login", (req, res, next) => {
  const error = req.flash('error') || []
  const success = req.flash('success') || []
  const username = req.flash('user') || []

  res.render('loginPage', { error, success, username })
});

router.get("/register", (req, res, next) => {
  // Récupération des messages flashs et affichage en console
  const error = req.flash('error') || []
  for (const err of error){
    console.log("Mon erreur flash :" + err);
  }
  res.render('registerPage', { error })
});

router.get("/", (req, res, next) => {
  res.render('homePage', { data: req.user })
});

/**
 * Ici on met en place une route accessible seulement si on est authentifié
 * En passant le middleware isAuth en paramètre, on ne pourra y accéder que si l'on est pas bloqué par isAuth
 */
router.get("/protected-route", (req, res, next) => {
  let msgData = getProfilePageData(req.isAuthenticated(), req.user)
  const infoData = {
    msg: msgData,
    user: req.user,
  }
  res.render('infoPage', { data: infoData })
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
 * La routes en cas de login success
 */
router.get("/login-success", (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

module.exports = router;
