const jwt = require('jsonwebtoken');
const sekrit = process.env.tokenSalt || 'tokenPepper';

module.exports = {
    sign(user) {
        return new Promise( (resolve, reject) => {
            const payload = {
                id: user._id,
                roles: user.roles 
            };

            jwt.sign(payload, sekrit, null, (err, token) => {
                if (err) return reject(err);
                resolve(token);
            });
        });
    },
    verify(token) {
        return new Promise( (resolve, reject) => {
            jwt.verify(token, sekrit, (err, payload) => {
                if (err) return reject(err);
                resolve(payload);
            });
        });
    }
};