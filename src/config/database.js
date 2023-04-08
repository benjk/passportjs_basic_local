const Sequelize = require("sequelize");
const DataTypes = require('sequelize/lib/data-types');

// Constantes à exporter en variable d'env par la suite
var env = process.env.NODE_ENV || "development";
var config = require("./data.json")[env];

const BDD_HOSTURL = config.host;
const BDD_PORT = config.port;
const BDD_USER = config.username;
const BDD_PASSWORD = config.password;
const BDD_BASENAME = config.database;

// Création de l'objet db à exposer
var db = {};

  /**
 * -------------- SEQUELIZE SETUP ----------------
 */
const sequelize = new Sequelize(BDD_BASENAME, BDD_USER, BDD_PASSWORD, {
  host: BDD_HOSTURL,
  dialect: "mysql",
});

const User = require('../models/user.model.js')(sequelize, DataTypes)
db.user = User;

// Création des associations entre les models si besoin

// on charge l'instance sequelize ET la classe pour accéder aux méthodes
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Sync Database
db.sequelize
  .sync()
  .then(function () {
    console.log("Nice! Database looks fine");
  })
  .catch(function (err) {
    console.log(err, "Something went wrong with the Database Update!");
  });


  /**
 * -------------- SESSION SETUP ----------------
 */
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const sessionStockageExpiration = 1000 * 60 * 60 * 24 * 30 // 30j
const sessionCookieExpiration = 1000 * 60 * 60 * 24 * 30 // 30j

const options = {
  host: BDD_HOSTURL,
  port: BDD_PORT,
  user: BDD_USER,
  password: BDD_PASSWORD,
  database: BDD_BASENAME,
  // On peut gérer la durée de vie d'une session facilement
  // les params suivant permettent de clear la db des sessions expirées
  expiration: sessionStockageExpiration,
  clearExpired: true,
  checkExpirationInterval: 20000,
};

const sessionStore = new MySQLStore(options);

const mSession = session({
  key: "session_cookie_name",
  secret: "some_session_cookie_secret",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: sessionCookieExpiration
  },
})
db.session = mSession

// Expose the connection
module.exports = db;
