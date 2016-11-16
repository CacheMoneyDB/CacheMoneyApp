const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const connection = require('./mongoose-setup-testdb');
const app = require('../lib/app');

chai.use(chaiHttp);

describe('yahoo api test', () => {
    
    const request = chai.request(app);
    const stockTicker = 'GOOGL';
    
    const Jared = {
        username: 'Jared Vennett',
        password: 'short'
    };

    const Charlie = {
        username: 'Charlie Geller',
        password: 'brownfield'
    };

    let tokenOne = '';
    let tokenTwo = '';

    const buyOrderOne = {
        stock: 'GOOGL',
        shares: 100,
        price: 10
    };

    const buyOrderTwo = {
        stock: 'AMZN',
        shares: 100,
        price: 10
    };

    before((done) => {
        const drop = () => connection.db.dropDatabase(done);
        if(connection.readyState === 1) drop();
        else connection.on('open', drop);
    });

    before(done => {
        request
            .post('/users/signup')
            .send(Jared)
            .then(res => {
                assert.isOk(res.body.token);
                tokenOne = res.body.token;
                return request
                        .post('/users/signup')
                        .send(Charlie)
            })
            .then(resTwo => {
                assert.isOk(resTwo.body.token);
                tokenTwo = resTwo.body.token;
                return request
                        .put('/portfolios/buy')
                        .set('Authorization', `Bearer ${tokenOne}`)
                        .send(buyOrderOne)
            })
            .then(resThree => {
                assert.isOk(resThree.body);
                return request
                        .put('/portfolios/buy')
                        .set('Authorization', `Bearer ${tokenTwo}`)
                        .send(buyOrderTwo)
            })
            .then(resFour => {
                assert.isOk(resFour.body);
                done();
            })
            .catch(err => done(err));
    });

    it('makes a /GET request for a certain stock using the API route', done => {
        request
            .get(`/yapi?stocks=${stockTicker}`)
            .then(res => {
                assert.isOk(res.body);
                assert.equal(res.body.snapshot[0].symbol, stockTicker);
                done();
            })
            .catch(err => done(err));
    });

    it('makes a /GET request to make a daily update to the server to update everyones portfolio', done => {
        request
            .get('/yapi/dailyUpdate')
            .then(res => {
                assert.equal(res.body.message,'updated portfolios completely');
                done();
            })
            .catch(err => done(err));
    });

});