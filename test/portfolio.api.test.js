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

    const Garbage = {
        username: 'Garbage',
        password: 'thisbigshort'
    };

    const Whatever = {
        username: 'whatever',
        password: 'thisbigshort'
    };

    const Anime = {
        username: 'Anime',
        password: 'thisbigshort'
    };

    const Movie = {
        username: 'Movie',
        password: 'thisbigshort'
    };

    const Laptop = {
        username: 'Laptop',
        password: 'thisbigshort'
    };

    const sellOrder = {
        stock: 'AAPL',
        shares: 50,
        price: 100
    };

    let tokenOne = '';
    let tokenTwo = '';

    // 1) This is pretty strange having two users 
    // with repeated code and the rest using a common 
    // function. Just add the token return to the 
    // common function!
    // 2) Sticking with promises is better than mixed cb/promises,
    // and makes all this much cleaner
    // 3) Seems like more of a setup than test
    function signup(user) {
        request
            .post('/users/signup')
            .send(user)
            .then(res => {
                const token = res.body.token;
                assert.isOk(token);
                return token;
            });
    };

    // you could use `done` here, just showing how
    // going to all Promises reduces Lines of Code
    before(() => {
        const users = [Steve, Jamie, Chris, Dave, Wayne, Tony, Garbage, Whatever, Anime, Movie, Laptop];
        const signups = users.map(user => signup(user));

        return Promise.all(signups).then(([one, two]) => {
            tokenOne = one;
            tokenTwo = two;
        });
    });

    // refactor to function simplifies tests:
    function buyStocks(buyOrder, token) {
        return request
            .put('/portfolios/buy')
            .set('Authorization', `Bearer ${token}`)
            .send(buyOrder)
            .then(({ body }) => body);
    }

    it('buys a list of stocks', done => {

        // by putting these here, we can visually
        // compare the math of the test
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

        buyStocks(buyOrderOne, tokenOne)
            .then(body => {
                assert.isOk(body);
                return buyStocks(buyOrderTwo, tokenTwo);
            })          
            .then(body => {
                assert.isOk(body);
                assert.equal(body.stockValue, 12000);
                assert.equal(body.cashValue, 88000);
                assert.deepEqual(body.stocks, { GOOGL: 100, AAPL: 100});
                done();
            })
            .catch(done);
    });

    it('sells some stocks', done => {
        request
            .put('/portfolios/sell')
            .set('Authorization', `Bearer ${tokenOne}`)
            .send(sellOrder)
            .then(res => {
                assert.isOk(res.body.cashValue);
                assert.deepEqual(res.body.stocks, {GOOGL: 100, AAPL: 50});
                done();
            })
            .catch(err => done(err));
    });

    it('uses a get request to get updated portfolio', function(done){
        this.timeout(5000);
        request
            .get('/portfolios')
            .set('Authorization', `Bearer ${tokenOne}`)
            .then(res => {
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
                assert.equal(res.body.length, 11);
                done();
            })
            .catch(err => done(err));
    });

    it('gets top 10 users based on netvalue', done => {
        request
            .get('/portfolios/leaderboard')
            .set('Authorization', `Bearer ${tokenTwo}`)
            .then(res => {
                assert.equal(res.body.length, 10);
                done();
            })
            .catch(err => done(err));
    });
});
