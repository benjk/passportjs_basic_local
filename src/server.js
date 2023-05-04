const express = require("express");
const path = require("path")
const passport = require("passport");
const flash = require('connect-flash')
const favicon = require('serve-favicon')

const routes = require("./config/routes.js");

// Create the Express application
const app = express();

//Favicon
app.use(favicon(path.join(__dirname, 'front',  'img', 'icons','favicon.ico')))

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'front'));

/**
 * -------------- DATABASE ----------------
 */
const db = require("./config/database.js");

/**
 * -------------- SESSION SETUP ----------------
 */

app.use(db.session);


/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

// Need to require the entire Passport config module so app.js knows about it
require("./config/passport.js")(passport, db.user);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash())

/**
 * -------------- ROUTES ----------------
 */

app.use(routes);

// Permet de donner accès à l'app aux fichier public (style, img,...)
// Sans cette ligne le CSS et les images ne sont pas interpretés
app.use(express.static(__dirname + '/front'));

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(process.env.PORT || 3000);
