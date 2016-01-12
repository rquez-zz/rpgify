import { expect } from 'chai';
import server from './../../server';
import jsonwebtoken from 'jsonwebtoken';
import config from './../../app/config/rpgify';
import fs from 'fs';

var login = {
    username: 'test'
};

var statusCode;
var key = fs.readFileSync(config.keyfile);

describe("When user logs in", () => {

    var jwt;

    before(done => {
        server.inject({
            url:'/login',
            method:'POST',
            payload: login,
            headers: {
                'Content-Type':'application/json'
            }
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
