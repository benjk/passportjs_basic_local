const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const passport = require("passport");

const routes = require("./routes/routes.js");

// Create the Express application
const app = express();

app.use(express.json());
app.use(express.urlencoded());

/**
 * -------------- SESSION SETUP ----------------
 */

const options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "first_bdd",
  // On peut gérer la durée de vie d'une session facilement
  // les params suivant permettent de clear la db des sessions expirées
  expiration: 1000 * 15,
  clearExpired: true,
  checkExpirationInterval: 20000,
};

const sessionStore = new MySQLStore(options);

app.use(
  session({
    key: "session_cookie_name",
    secret: "session_cookie_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // = 1 jour
    },
  })
);

/**
 * -------------- MODELS ----------------
 */
const db = require("./models/database.js");

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

// Need to require the entire Passport config module so app.js knows about it
require("./config/passport.js")(passport, db.user);

app.use(passport.initialize());
app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000);
