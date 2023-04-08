const express = require("express");
const passport = require("passport");

const routes = require("./config/routes.js");

// Create the Express application
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


/**
 * -------------- DATABASE ----------------
 */
const db = require("./models/database.js");

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

/**
 * -------------- ROUTES ----------------
 */

app.use(routes);

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000);
