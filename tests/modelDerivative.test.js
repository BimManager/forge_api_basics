const assert = require('assert');

const fetch = (...args) => import('node-fetch')
      .then(({ default: fetch }) => fetch(...args));

describe('Model Derivative API', function() {
  describe('GET /api/forge/modelderivates/formats', function() {
    it('should return a json response', function() {
      return new Promise(function(resolve, reject) {
        fetch('http://localhost:3000/api/forge/modelderivative/formats')
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
