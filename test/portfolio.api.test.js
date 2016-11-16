const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const connection = require('./mongoose-setup-testdb');
const app = require('../lib/app');

chai.use(chaiHttp);

describe('tests out the portfolio api', () => {
    const request = chai.request(app);

    before((done) => {
        const drop = () => connection.db.dropDatabase(done);
        if(connection.readyState === 1) drop();
        else connection.on('open', drop);
    });

    const Steve = {
        username: 'Steve Baum',
        password: 'thisbigshort'
    };

    const Jamie = {
        username: 'Jamie Shipley',
        password: 'thebigshort'
    };

    const Chris = {
        username: 'Christopheles',
        password: 'testtest'
    };

    const Dave = {
        username: 'Dave',
        password: 'davewashere'
    };

    const Wayne = {
        username: 'Bruce Wayne',
        password: 'gotham'
    };

    const Tony = {
        username: 'Ironman',
        password: 'marvel'
    };

    const buyOrderOne = {
        stock: 'AAPL',
        shares: 100,
        price: 50
    };

    const buyOrderTwo = {
        stock: 'GOOGL',
        shares: 100,
        price: 70
    };

    const sellOrder = {
        stock: 'AAPL',
        shares: 50,
        price: 100
    };

    let tokenOne = '';
    let tokenTwo = '';

    it('signs up a new user Steve', done => {
        request
            .post('/users/signup')
            .send(Steve)
            .then(res => {
                assert.isOk(res.body.token);

                tokenOne = res.body.token;
                done();
            })
            .catch(err => done(err));
    });

    it('signs up a new user Jamie', done => {
        request
            .post('/users/signup')
            .send(Jamie)
            .then(res => {
                assert.isOk(res.body.token);
                tokenTwo = res.body.token;
                done();
            })
            .catch(err => done(err));
    });

    function userSignup(user, doneCB) {
        request
            .post('/users/signup')
            .send(user)
            .then(res => {
                assert.isOk(res.body.token);
                doneCB();
            })
            .catch(err => doneCB(err));
    };

    it('signs up new user Chris', done => {
        userSignup(Chris, done);
    });

    it('signs up new user Dave', done => {
        userSignup(Dave, done);
    });

    it('signs up new user Wayne', done => {
        userSignup(Wayne, done);
    });

    it('signs up new user Tony', done => {
        userSignup(Tony, done);
    });

    it('buys a list of stocks', done => {
        request
            .put('/portfolios/buy')
            .set('Authorization', `Bearer ${tokenOne}`)
            .send(buyOrderOne)
            .then(res => {
                assert.isOk(res.body);
                return request
                    .put('/portfolios/buy')
                    .set('Authorization', `Bearer ${tokenOne}`)
                    .send(buyOrderTwo);
            })
            .then(resTwo => {
                assert.isOk(resTwo.body);
                assert.equal(resTwo.body.stockValue, 12000);
                assert.equal(resTwo.body.cashValue, 88000);
                assert.deepEqual(resTwo.body.stocks, { GOOGL: 100, AAPL: 100});
                done();
            })
            .catch(err => done(err));
    });

    it('sells some stocks', done => {
        request
            .put('/portfolios/sell')
            .set('Authorization', `Bearer ${tokenOne}`)
            .send(sellOrder)
            .then(res => {
                assert.equal(res.body.cashValue, 93000);
                assert.deepEqual(res.body.stocks, {GOOGL: 100, AAPL: 50});
                done();
            })
            .catch(err => done(err));
    });

    it('uses a get request to get updated portfolio', done => {
        request
            .get('/portfolios')
            .set('Authorization', `Bearer ${tokenOne}`)
            .then(res => {
                console.log('res.body portfolio: ', res.body);
                assert.isOk(res.body);
                done();
            })
            .catch(err => done(err));
    });


    it('gets every user in the database', done => {
        request
            .get('/portfolios/all')
            .set('Authorization', `Bearer ${tokenTwo}`)
            .then(res => {
                assert.equal(res.body.length, 6);
                done();
            })
            .catch(err => done(err));
    });

    it('gets top 5 users based on netvalue', done => {
        request
            .get('/portfolios/leaderboard')
            .set('Authorization', `Bearer ${tokenTwo}`)
            .then(res => {
                assert.equal(res.body.length, 5);
                done();
            })
            .catch(err => done(err));
    });
});
