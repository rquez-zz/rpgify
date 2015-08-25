'use strict';

require('babel/register');

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['sample.js']
}
