export function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.send('<p>tu ne peux pas accéder ici sans être connecté !</p>')
    }
}

export function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
        next();
    } else {
        res.send('<p>tu ne peux pas accéder ici car tu n\'es pas admin !</p>')
        // res.status(401).json({ msg: 'You are not authorized to view this resource because you are not an admin.' });
    }
}