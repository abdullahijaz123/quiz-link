const passport = require('passport');

const authenticateJwt = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                msg: 'Unauthorized',
                error: info ? info.message : 'Invalid token'
            });
        }
        req.user = user;
        next();
    })(req, res, next);
};

module.exports = authenticateJwt;
