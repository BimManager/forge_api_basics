const assert = require('assert');

const fetch = (...args) => import('node-fetch')
      .then(({ default: fetch }) => fetch(...args));

describe('Data Management API', function() {
  describe('GET /api/forge/oss/buckets', function() {
    it('returns a json response', function() {
      return new Promise(function(resolve, reject) {
        fetch('http://localhost:3000/api/forge/oss/buckets')
          .then(function(response) {
            assert.equal(response.status, 200);
            assert.match(response.headers.get('content-type'),
                         /application\/json/);
            resolve();
          })
          .catch(function(error) {
            reject(error);
          });
      });
    });
  });
});
