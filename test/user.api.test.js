const app = require('../lib/app');
const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
const connection = require('./mongoose-setup-testdb');

chai.use(chaiHttp);

const user = {
    username: 'awesomeUser',
    password: 'awesomePassword'
};

const userAdmin = {
    username: 'userAdmin',
    password: 'adminPassword',
    roles: ['admin']
};

//set another user named admin
//make sure admin can use things like delete

//portfolios api tests.

//test yahoo api.

describe('user management', () => {

    before(done => {
        const drop = () => connection.db.dropDatabase(done);
        if(connection.readyState === 1) drop();
        else connection.on('open', drop);
    });

    const request = chai.request(app);

    function badRequest(url, send, error, done){
        request
          .post(url)
          .send(send)
          .then(() => done('status should not be 200'))
          .catch(res => {
              assert.equal(res.status, 400);
              assert.equal(res.response.body.error, error);
              done();
          })
          .catch(done);
    }

    it('signup requires username', done => {
        badRequest('/users/signup', {password:'coolPassword'}, 'Valid username and password required', done);
    });

    it('signup requires password', done => {
        badRequest('/users/signup', {username:'coolUsername'}, 'Valid username and password required', done);
    });

    let userToken = '';
    let adminToken = '';

    it('/users/signup', done => {
        request
      .post('/users/signup')
      .send(user)
      .then(res => assert.isOk( userToken = res.body.token ))
      .then(done)
      .catch(done);
    });

    it('cannot be the same username', done => {
        badRequest('/users/signup', user, 'username awesomeUser already exists', done);
    });

    it('token is valid', done => {
        request
      .get('/users/signin')
      .set('authorization', `Bearer ${userToken}`)
      .then(res => assert.isOk(res.body))
      .then(done, done);
    });

// signin and get a token back
// make a new request with the token to the validate api path
// expect this request to return true

    it('signin', done => {
        request
          .post('/users/signin')
          .send(user)
          .then(res => {
              request
              .post('/users/validate')
              .set('authorization', `Bearer ${res.body.token}`)
              .then(res => {
                  assert.isOk(res.body.valid);
                  done();
              });
          })
            .catch(done);
    });

    describe('user admin access', () => {

        it('signup admin', done => {
            request
          .post('/users/signup')
          .send(userAdmin)
          .then(res => {
              // console.log('res from describe test: ', res);
              assert.isOk(adminToken = res.body.token);
              done();
          })
          // .then(done) //expect no problems and call done();
          .catch(err => {
              done(err); //if there was an error, mocha displays as error
          });
        });

      //sign in as admin here

        it('non-admins cannot delete', done => {
            request
          .del('/users')
          .set('authorization', `Bearer ${userToken}`)
          .then(() => {
              // console.log('res: ', res);
              done('status should error');
          })
          .catch(err => {
              // console.log('err in non-admin: ', err);
              //put an assert here to check for correct error.
              assert.equal(err, 'Error: Bad Request');
              done();
          });
        });

        it('admins can delete', done => {
            request
          .del('/users')
          .set('authorization', `Bearer ${adminToken}`)
          .send({username:'awesomeUser'})
          .then(() => done())
          .catch(err => {
              done(err);
          });
        });

        // it('admin sign in', done => {
        //   request
        //     .post('users/signin')
        //     .send(userAdmin)
        //     .then(res => {
        //       .delete('')
        //     })
        //
        // });

    });
});
