const User = require('../lib/models/user');
const assert = require('chai').assert;

describe('user model', () => {

    it('validates with username, password, roles', done => {
        const user = new User();
        user.username = 'testUser';
        user.password = 'testPassword';
        user.roles = [];

        user.validate(err => {
            if(!err) done();
            else done(err);
        });
    });

    it('name is required', done => {
        const user = new User();
        user.password = 'testPassword';

        user.validate(err => {
            assert.isOk(err, 'name should be required');
            done();
        });
    });

    it('password is required', done => {
        const user = new User();
        user.username = 'testName';

        user.validate(err => {
            assert.isOk(err, 'password should be required');
            done();
        });
    });

});
