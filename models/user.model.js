module.exports = function(sequelize, Sequelize) {
  var User = sequelize.define("user_passport", {
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    hash: {
      type: Sequelize.STRING,
      allowNull: false
    },
    salt: {
      type: Sequelize.STRING,
    },
    admin: {
      type: Sequelize.BOOLEAN,
    }
 });
  return User;
}