const tokenSvc = require('./token');

module.exports = function ensureAuth() {
    return function ensureAuth(req, res, next) {
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            return next({code: 400, error: 'unauthorized, no token provided'});
        };

        const [bearer, jwt] = authHeader.split(' ');
        if(bearer !== 'Bearer' || !jwt){
            return next({code: 400, error:'unauthorized, invalid token'});
        };

        tokenSvc.verify(jwt)
            .then(payload => {
                req.user = payload;
                next();
            })
            .catch(err => {
                next({code: 400, error: 'unauthorized, invalid token'});
            });
    };
};
