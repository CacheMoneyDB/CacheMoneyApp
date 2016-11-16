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

    it('signs up a new user', done => {
        request
            .post('/users/signup')
            .send(Steve)
            .then(res => {
                assert.isOk(res.body.token);
                tokenOne = res.body.token;
                done()
            })
            .catch(err => done(err));
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
                    .send(buyOrderTwo)
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
                assert.isOk(res.body)
                done();
            })
            .catch(err => done(err));
    });
});