const assert = require('assert');

const fetch = (...args) => import('node-fetch')
      .then(({ default: fetch }) => fetch(...args));

describe("Authentication API", function() {
  describe('GET /api/forge/auth/token', function() {
    it ('should return a token { access_token, expires_in }', function() {
      return new Promise(function(resolve, reject) {
        fetch('http://localhost:3000/api/forge/auth/token')
          .then(function(response) {
            assert.equal(response.status, 200);
            assert.match(response.headers.get('content-type'),
                         /application\/json/);
            response.json().then(function(token) {
              assert.notEqual(token.access_token, undefined);
              assert.notEqual(token.expires_in, undefined);
              resolve();
            });
          })
          .catch(function(err) {
            reject(err);
          });
      });
    });
  });
});

