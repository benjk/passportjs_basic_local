const { validPassword, genPassword } = require("../utils/passwordUtils.js");

module.exports = function (passport, user) {
  var User = user;
  var LocalStrategy = require("passport-local").Strategy;
  //serialize
  passport.serializeUser(function (user, done) {
    console.log("serializing user: ", user);
    done(null, user.id);
  });
  // deserialize user
  passport.deserializeUser(function (id, done) {
    User.findByPk(id).then(function (user) {
      if (user) {
        done(null, user.get());
      } else {
        done(null, false);
      }
    });
  });

  //LOCAL SIGNUP
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      function (req, username, password, done) {
        User.findOne({
          where: {
            username: username,
          },
        }).then(function (user) {
          if (user) {
            return done(null, false, {
              message: "That username is already taken",
            });
          } else {
            console.log(
              "Username + password : " + username + " et " + password
            );

            const saltHash = genPassword(password);

            const salt = saltHash.salt;
            const hash = saltHash.hash;
            var data = {
              username: username,
              hash: hash,
              salt: salt,
              admin: false
            };

            User.create(data).then(function (newUser, created) {
              if (!newUser) {
                return done(null, false);
              }

              if (newUser) {
                return done(null, newUser);
              }
            });
          }
        });
      }
    )
  );

  //LOCAL SIGNIN
  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will not override with email

        usernameField: "username",

        passwordField: "password",

        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },

      function (req, username, password, done) {
        var User = user;

        User.findOne({
          where: {
            username: username,
          },
        })
          .then(function (user) {
            if (!user) {
              return done(null, false, {
                message: "Username does not exist",
              });
            }

            if (!validPassword(password, user.hash, user.salt)) {
              return done(null, false, {
                message: "Incorrect password.",
              });
            }

            // Si le pass est valide alors on renvoie l'user
            var userinfo = user.get();
            return done(null, userinfo);
          })
          .catch(function (err) {
            console.log("Error:", err);

            return done(null, false, {
              message: "Something went wrong with your Signin",
            });
          });
      }
    )
  );
};
