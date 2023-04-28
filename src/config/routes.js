const express = require("express")
const router = express.Router()
const passport = require("passport")
const path = require("path")
const { checkSchema, validationResult } = require('express-validator')

const { getProfilePageData, getAdminPageData, getLoginSuccessData } = require("../utils/messageBuilder.js")
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
  // Récupération des messages flashs
  const error = req.flash('error') || []
  res.render('registerPage', { error })
});

router.get("/", (req, res, next) => {
  res.render('homePage', { data: req.user })
});

/**
 * Ici on met en place une route accessible seulement si on est authentifié
 * on récupère les données à afficher depuis le messageBuilder
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
router.get("/admin-route", (req, res, next) => {
  let msgData = getAdminPageData((req.isAuthenticated() && req.user.admin), req.user)
  const infoData = {
    msg: msgData,
    user: req.user,
  }
  res.render('infoPage', { data: infoData })
});

/**
 * La routes en cas de login success
 */
router.get("/login-success", (req, res, next) => {
  let msgData = getLoginSuccessData((req.isAuthenticated() && req.user.admin), req.user)
  const infoData = {
    msg: msgData,
    user: req.user,
  }
  res.render('infoPage', { data: infoData })
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

module.exports = router;
