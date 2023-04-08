function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        const loginBtn = "<form action='/login'><input type='submit' value='Login'/></form>"
        const registerBtn = "<form action='/register'><input type='submit' value='Register'/></form>"
        res.send('<p>tu ne peux pas accéder ici sans être connecté !</p>' + loginBtn + registerBtn);
    }
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
        next();
    } else {
        res.send('<p>tu ne peux pas accéder ici car tu n\'es pas admin !</p>');
        // res.status(401).json({ msg: 'You are not authorized to view this resource because you are not an admin.' });
    }
}

module.exports = {
    isAuth,
    isAdmin
};