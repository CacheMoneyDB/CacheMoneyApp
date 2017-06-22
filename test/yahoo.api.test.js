const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const connection = require('./mongoose-setup-testdb');
const app = require('../lib/app');

chai.use(chaiHttp);

describe('yahoo api test', () => {

    const request = chai.request(app);

    const Jared = {
        username: 'Jared Vennett',
        password: 'short'
    };

    const Charlie = {
        username: 'Charlie Geller',
        password: 'brownfield'
    };

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

    // try to be consistent with single-param arrow fns
    before(done => {
        const drop = () => connection.db.dropDatabase(done);
        if(connection.readyState === 1) drop();
        else connection.on('open', drop);
    });

    // 1. Don't serialize work that can be done in parallel
    // 2. Refactor common work to functions
    // 3. Structure logically to make it easier to see what's going on
    function createUserAndBuyStocks(user, order) {
        return request
            .post('/users/signup')
            .send(user)
            .then(res => {
                const token = res.body.token;
                assert.isOk(token);
                return token;
            })
            .then(token => {
                return request
                    .put('/portfolios/buy')
                    .set('Authorization', `Bearer ${token}`)
                    .send(order);
            })
            .then(res => assert.isOk(res.body));
    }

    before(done => {
        Promise.all([
            createUserAndBuyStocks(Jared, buyOrderOne), 
            createUserAndBuyStocks(Charlie, buyOrderTwo)
        ]).catch(done);
    });

    // nice job on using anonymous function to retain `this`  
    // context mocha needs to change timeout
    it('makes a /GET request for a certain stock using the API route', function(done){
        this.timeout(5000);
        // this is only used here, better to scope to local function
        const stockTicker = 'GOOGL';

        request
            .get(`/yapi?stocks=${stockTicker}`)
            // use destructuring to simplify:
            .then(({ body }) => {
                assert.isOk(body);
                assert.equal(body.snapshot[0].symbol, stockTicker);
                done();
            })
            // surrounding arrow function is unnecessary
            .catch(done);
    });

    it('makes a /GET request to make a daily update to the server to update everyones portfolio', function(done){
        this.timeout(5000);
        request
            .get('/yapi/dailyUpdate')
            .then(res => {
                assert.equal(res.body.message,'updated portfolios completely');
                done();
            })
            .catch(err => done(err));
    });

});
