const Sequelize = require("sequelize");
const DataTypes = require('sequelize/lib/data-types');

/**
 * -------------- DATABASE ----------------
 */

// Constantes à exporter en variable d'env par la suite
const BDD_HOSTURL = "localhost";
const BDD_USER = "root";
const BDD_PASSWORD = "root";
const BDD_BASENAME = "first_bdd";

// SEQUELIZE
const sequelize = new Sequelize(BDD_BASENAME, BDD_USER, BDD_PASSWORD, {
  host: BDD_HOSTURL,
  dialect: "mysql",
});

// Création de l'objet db à exposer
var db = {};

// Chargement des modèles depuis le dossier models
// 2 lignes par model
const User = require('./user.model.js')(sequelize, DataTypes)
db.user = User;

// Création des associations entre les models
// Object.keys(db).forEach(function (modelName) {
//   if ("associate" in db[modelName]) {
//     db[modelName].associate(db);
//   }
// });


// on ajoute l'instance sequelize
// ET la classe Sequelize pour pouvoir accéder à ses méthodes
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

// Expose the connection
module.exports = db;
