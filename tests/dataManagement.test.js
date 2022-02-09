const assert = require('assert');

const fetch = (...args) => import('node-fetch')
      .then(({ default: fetch }) => fetch(...args));

describe('Data Management API', function() {
  describe('GET /api/forge/oss/buckets', function() {
    it('should return a json response', function() {
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

  const bucketKey = 'foo_bar_baz_fido';
  describe('POST /api/forge/oss/buckets', function() {
    it('should create a new bucket', function() {
      return new Promise(function(resolve, reject) {
        fetch('http://localhost:3000/api/forge/oss/buckets', {
          method: 'post',
          body: JSON.stringify({
            bucketKey: bucketKey,
            policyKey: 'transient'
          }),
          headers: {
            'Content-Type': 'application/json',
            'x-ads-region': 'US'
          }
        })
          .then(function(response) {
            assert.equal(response.status, 200);
            resolve();
          })
          .catch(function(error) {
            reject(error);
          });
      });
    });
  });

  describe(`GET /api/forge/oss/buckets/${bucketKey}/details`, function() {
    it('should return a json response', function() {
      return new Promise(function(resolve, reject) {
        fetch(`http://localhost:3000/api/forge/oss/buckets/${bucketKey}/details`)
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

  describe('DELETE /api/forge/oss/buckets/:bucketKey', function() {
    it('should delete the bucket', function() {
      fetch(`http://localhost:3000/api/forge/oss/buckets/${bucketKey}`, {
        method: 'delete'
      })
        .then(function(response) {
          assert.equal(response.status, 200);
          resolve();
        })
        .catch(function(error) {
          reject(error);
        })
    });
  });
});

