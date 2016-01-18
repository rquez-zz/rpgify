import { expect } from 'chai';
import server from './../../server';
import jsonwebtoken from 'jsonwebtoken';
import config from './../../app/config/rpgify';
import User from './../../app/models/schema';

import fs from 'fs';
import mongoose from 'mongoose';

var key = fs.readFileSync(config.key.path);

describe('RPGify Integration Test', () => {

    describe('When a user registers', () => {

        var user = {
            username: 'test',
            password: 'password',
            firstname: 'firstname',
            lastname: 'lastname'
        }, statusCode;

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

        it("should return a 204 status code", () => {
            expect(statusCode).to.equal(204);
        });

        it('should populate database with a user', (done) => {
            User.findOne({ username: user.username }, (err, user) => {
                expect(user.username).to.equal('test');
                done();
            });
        });

        describe('When a user logs in', () => {

            var login = {
                username: 'test',
                password: 'password'
            }, jwt;

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

                var userToken;

                before(done => {
                    jsonwebtoken.verify(jwt, key, (err, decoded) => {
                        userToken = decoded;
                        done();
                    });
                });

                it("should have username inside", () => {
                    expect(userToken.username).to.equal(login.username);
                });
            });
        });
    });
});
