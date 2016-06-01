var server = require('./../../server');

var expect = require('chai').expect;
var jsonwebtoken = require('jsonwebtoken');
var fs = require('fs');
var mongoose = require('mongoose');
var nock = require('nock');

var config = require('./../../app/config/rpgify');
var User = require('./../../app/models/schema');

const key = fs.readFileSync(config.key.path);
const tokenFixture = fs.readFileSync('./spec/fixtures/test-token.json');
const profileFixture = fs.readFileSync('./spec/fixtures/test-profile.json');

describe('RPGify Integration Test', () => {

    var statusCode;

    describe('When user authenticates with Google', () => {

        var authUrl;

        before(done => {
            server.inject({
                url:'/auth',
                method:'GET',
            }, response => {
                statusCode = response.statusCode;
                authUrl = response.headers.location;
                done();
            });
        });

        it("should return a 302 status code", () => {
            expect(statusCode).to.equal(302);
        });

        it('should have google auth url in location header', () => {
            expect(authUrl).to.not.be.empty;
        });

        describe('When user registers with Google', () => {
            var token = nock('https://accounts.google.com')
                        .persist()
                        .post('/o/oauth2/token')
                        .reply(200, tokenFixture);

            var profile = nock('https://www.googleapis.com')
                        .get('/plus/v1/people/me')
                        .reply(200, profileFixture);

            before(done => {
                server.inject({
                    url:'/auth-callback?code=randomcode',
                    method:'GET',
                }, response => {
                    statusCode = response.statusCode;
                    done();
                });
            });

            it('should return a 201', () => {
                expect(statusCode).to.equal(201);
            });

            describe('When user logs in with Google', () => {

                var jwt;

                var token = nock('https://accounts.google.com')
                            .persist()
                            .post('/o/oauth2/token')
                            .reply(200, tokenFixture);

                var profile = nock('https://www.googleapis.com')
                            .get('/plus/v1/people/me')
                            .reply(200, profileFixture);

                before(done => {
                    server.inject({
                        url:'/auth-callback?code=randomcode',
                        method:'GET',
                    }, response => {
                        statusCode = response.statusCode;
                        jwt = response.payload;
                        done();
                    });
                });

                it('should return a 200', () => {
                    expect(statusCode).to.equal(200);
                });

                describe('When a Google user is deleted', () => {

                    before(done => {
                        server.inject({
                            url:'/user',
                            method:'DELETE',
                            headers: {
                                'Content-Type':'application/json',
                                'Authorization':'Bearer ' + jwt
                            }
                        }, response => {
                            statusCode = response.statusCode;
                            done();
                        });
                    });

                    it("should return a 204 status code", () => {
                        expect(statusCode).to.equal(204);
                    });
                });
            });
        });
    });

    describe('When a user registers with email', () => {

        var login = {
            email: 'email@email.com',
            password: 'password'
        }, jwt;

        var user = {
            password: 'password',
            name: 'name',
            email: 'email@email.com'
        };

        after(done => {
            server.inject({
                url:'/login',
                method:'POST',
                payload: login,
                headers: { 'Content-Type':'application/json' }
            }, response => {
                statusCode = response.statusCode;
                jwt = response.payload;
                server.inject({
                    url:'/user',
                    method:'DELETE',
                    headers: { 'Authorization':'Bearer ' + jwt }
                }, response => {
                    statusCode = response.statusCode;
                    done();
                });
            });
        });

        before(done => {
            server.inject({
                url:'/user',
                method:'POST',
                payload: user,
                headers: { 'Content-Type':'application/json' }
            }, response => {
                statusCode = response.statusCode;
                done();
            });
        });

        it("should return a 201 status code", () => {
            expect(statusCode).to.equal(201);
        });

        it('should populate database with a user', (done) => {
            User.findOne({ email: user.email }, (err, foundUser) => {
                expect(foundUser.email).to.equal(user.email);
                done();
            });
        });

        describe('When a user logs in successfully', () => {

            var token;

            before(done => {
                server.inject({
                    url:'/login',
                    method:'POST',
                    payload: login,
                    headers: { 'Content-Type':'application/json' }
                }, response => {
                    statusCode = response.statusCode;
                    jwt = response.payload;
                    done();
                });
            });


            it("should return a 200 status code", () => {
                expect(statusCode).to.equal(200);
            });

            it("should return a jwt", () => {
                expect(jwt).to.not.be.empty;
            });

            describe("When jwt is decoded", () => {

                before(done => {
                    jsonwebtoken.verify(jwt, key, (err, decoded) => {
                        token = decoded;
                        done();
                    });
                });

                it("should have email inside", () => {
                    expect(token.email).to.equal(login.email);
                });
            });

            describe('When a user is retrieved', () => {

                var getUser;

                before(done => {
                    server.inject({
                        url:'/user',
                        method:'GET',
                        headers: { 'Authorization':'Bearer ' + jwt }
                    }, response => {
                        statusCode = response.statusCode;
                        getUser = JSON.parse(response.payload);
                        done();
                    });
                });

                it("should return a 200 status code", () => {
                    expect(statusCode).to.equal(200);
                });

                it("should return test user", () => {
                    expect(getUser.email).to.equal(user.email);
                });

                describe('When user logs in again', () => {

                    before(done => {
                        server.inject({
                            url:'/login',
                            method:'POST',
                            payload: login,
                            headers: { 'Content-Type':'application/json' }
                        }, response => {
                            statusCode = response.statusCode;
                            jwt = response.payload;
                            done();
                        });
                    });

                    it("should update user's last login date", (done) => {
                        server.inject({
                            url:'/user',
                            method:'GET',
                            headers: { 'Authorization':'Bearer ' + jwt }
                        }, response => {
                            statusCode = response.statusCode;
                            var getUserLoggedIn = JSON.parse(response.payload);
                            expect(getUserLoggedIn.lastLogin).to.not.equal(getUser.lastLogin);
                            done();
                        });
                    });
                });
            });

            describe('When a user is updated successfully', () => {

                var patch = {
                    name: 'newName',
                    email: 'new@email.com'
                };

                before(done => {
                    server.inject({
                        url:'/user',
                        method:'PATCH',
                        payload: patch,
                        headers: {
                            'Content-Type':'application/json',
                            'Authorization':'Bearer ' + jwt
                        }
                    }, response => {
                        statusCode = response.statusCode;
                        done();
                    });
                });

                it("should return a 204 status code", () => {
                    expect(statusCode).to.equal(204);
                });

                it("should update user in database", done => {
                    User.find({ _id: token._id }, (err, foundUser) => {
                        expect(foundUser.name === patch.name);
                        expect(foundUser.email === patch.email);
                        done();
                    });
                });
            });

            describe('When a user attempts invalid patch', () => {

                var patch = {
                    firstname: 'newName'
                };

                before(done => {
                    server.inject({
                        url:'/user',
                        method:'PATCH',
                        payload: patch,
                        headers: {
                            'Content-Type':'application/json',
                            'Authorization':'Bearer ' + jwt
                        }
                    }, response => {
                        statusCode = response.statusCode;
                        done();
                    });
                });

                it("should return a 422 status code", () => {
                    expect(statusCode).to.equal(422);
                });
            });

            describe('When a user is deleted', () => {

                before(done => {
                    server.inject({
                        url:'/user',
                        method:'DELETE',
                        headers: {
                            'Content-Type':'application/json',
                            'Authorization':'Bearer ' + jwt
                        }
                    }, response => {
                        statusCode = response.statusCode;
                        done();
                    });
                });

                it("should return a 204 status code", () => {
                    expect(statusCode).to.equal(204);
                });

                it("should delete user in database", done => {
                    User.find({ _id: token._id }, (err, foundUser) => {
                        expect(!foundUser);
                        done();
                    });
                });

            });

        });
    });
});
