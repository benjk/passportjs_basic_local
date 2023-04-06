import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { validPassword } from '../utils/passwordUtils.js'
import connection from './database.js';

const verifyAuthCallback = (username, password, done) => {

    const query = `select * from users where username = '${ username }'`;

    connection.query(query, (err, result) => {
        if (err) {
        console.log("Erreur de query");
         return done(err);
        }
        if (result.length == 0){
            console.log(`user ${username} non trouvé`);
            return done(null, false); 
        }
        const user = result[0];
        console.log("user trouvé :" + user);
        
        if (validPassword(password, user.hash, user.salt)){
            console.log("bon mdp !");
            return done(null, user);
        } else {
            console.log("mauvais mdp !");
            return done(null, false);
        }
      });
}

const strategy  = new LocalStrategy(verifyAuthCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    const query = `select * from users where id = '${ userId }'`;

    connection.query(query, (err, result) => {
        if (err) {
        console.log("Erreur de query lors du deserialize");
         return done(err);
        }
        if (result.length == 0){
            console.log(`user ${userId} non trouvé lors du deserialize`);
            return done(null, false); 
        } else {
            const user = result[0];
            return done(null, user);
        }
      });
});

