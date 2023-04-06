import { createConnection } from "mysql";

// require('dotenv').config();

/**
 * -------------- DATABASE ----------------
 */

// Constantes
const BDD_HOSTURL = "localhost";
const BDD_USER = "root";
const BDD_PASSWORD = "root";
const BDD_BASENAME = "first_bdd";

// Connexion à la BDD
const connection = createConnection({
  host: BDD_HOSTURL,
  user: BDD_USER,
  password: BDD_PASSWORD,
  database: BDD_BASENAME,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySql server");
});


// Expose the connection
export default connection;
