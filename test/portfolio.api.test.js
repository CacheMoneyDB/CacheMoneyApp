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

    const orderOne = {
        stock: 'AAPL',
        shares: 100,
        price: 50
    };

    const orderTwo = {
        stock: 'GOOGL',
        shares: 100,
        price: 70
    };

    let token = '';

    it('signs up a new user', done => {
        request
            .post('/users/signup')
            .send(Steve)
            .then(res => {
                assert.isOk(res.body.token);
                token = res.body.token;
                done()
            })
            .catch(err => done(err));
    });

    it('buys a list of stocks', done => {
        request
            .put('/portfolios/buy')
            .set('Authorization', 'Bearer ' + token)
            .send(orderOne)
            .then(res => {
                console.log(res.body);
                done();
            })
            .catch(err => done(err));
    });

});