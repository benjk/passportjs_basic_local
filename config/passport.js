const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { validPassword } = require("../utils/passwordUtils.js");
const { getUserById, getUser } = require("../models/user.controller.js");

const verifyAuthCallback = (username, password, done) => {
  const user = getUser(username);
  console.log("Voici mon user : " + user);
  if (user != null) {
    if (validPassword(password, user.hash, user.salt)) {
      console.log("bon mdp !");
      return done(null, user);
    } else {
      console.log("mauvais mdp !");
      return done(null, false);
    }
  } else {
    console.log("user non trouvé");
    return done(null, false);
  }
};

const strategy = new LocalStrategy(verifyAuthCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  const user = getUserById(userId);

  if (user != null) {
    return done(null, user);
  } else {
    return done(null, false);
  }
});
