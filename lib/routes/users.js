const router = require('express').Router();
const bodyParser = require('body-parser').json();
const token = require('../auth/token');
const userModel = require('../models/user');
const portfolioModel = require('../models/portfolio');
const ensureAuth = require('../auth/ensure-auth')();
const ensureRole = require('../auth/ensure-role');

router
    .post('/validate', ensureAuth, bodyParser, (req, res, next) => {
        res.send({valid:true, username: req.user.user});
    })

    .post('/signup', bodyParser, (req, res, next) => {
        const {username, password} = req.body;
        delete req.body.password;

        if (!username || !password) {
            return next({
                code: 400,
                error: 'Valid username and password required'
            });
        };

        userModel
            .find({username})
            .count()
            .then(count => {
                if(count > 0) throw {code: 400, error: `Username ${username} already exists`};
                const user = new userModel(req.body);
                user.generateHash(password);
                return user.save();
            })
            .then(user => {
                const newPort = new portfolioModel({userId:user._id});
                newPort.save();
                return token.sign(user);
            })
            .then(token => {
                res.send({username, token});
            })
            .catch(next);
    })

    .post('/signin', bodyParser, (req, res, next) => {
        const {username, password} = req.body;
        delete req.body.password;

        userModel
            .findOne({username})
            .then(user => {
                if (!user || !user.compareHash(password)) throw {code: 400, error: 'Invalid username or password'};
                return token.sign(user);
            })
            .then(token => {
                res.send({username, token});
            })
            .catch(next);
    })

    .delete('/', ensureAuth, ensureRole(['admin']), bodyParser, (req, res, next) => {
        const {username} = req.body;
        const removedUser = {};
        userModel
            .findOne({username})
            .then(user => {
                return user.remove();
            })
            .then(user => {
                return portfolioModel.find({userId:user._id})
                  .remove();
            })
            .then(portfolio => {
                res.send({removedUser:removedUser,removedPortfolio:portfolio});
            })
            .catch(next);
    });

module.exports = router;
