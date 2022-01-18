const express = require('express');
const multer = require('multer');
const busboy = require('busboy');

const config = require('../../../../config');
const httpClient = require('../../../../helpers/httpClient');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route('/buckets')
  .get(function(req, res) {
    options = Object.assign({}, config.options, {      
      path: '/oss/v2/buckets',
      method: 'GET'
    });
    httpClient.makeHttpRequest(options)
      .then(function(bucketsRes) {
        httpClient.sendResponseBasedOnIncomingMessage(res, bucketsRes);
      })
      .catch(function(err) {
        httpClient.respondWithError(res, err);
      });
  })
  .post(function(req, res) {    
    options = Object.assign({}, config.options, {
      path: '/oss/v2/buckets',
      method: 'POST',
    });
    Object.assign(options.headers, {
      'Content-Type': 'application/json',
      'x-ads-region': 'US'
    });
    httpClient.makeHttpRequest(options, JSON.stringify(req.body))
      .then(function(bucketsRes) {
        httpClient.sendResponseBasedOnIncomingMessage(res, bucketsRes);
      })
      .catch(function(err) {
        httpClient.respondWithError(res, err);
      });
  });

router.get('/buckets/:bucketKey/details', function(req, res) {
  const options = Object.assign({}, config.options, {
    path: `/oss/v2/buckets/${req.params.bucketKey}/details`,
    method: 'GET',
  });
  httpClient.makeHttpRequest(options)
    .then(function(bucketsRes) {
      httpClient.sendResponseBasedOnIncomingMessage(res, bucketsRes);
    })
    .catch(function(err) {
      httpClient.responseWithError(res, err);
    });    
});

router.delete('/buckets/:bucketKey', function(req, res) {
  const options = Object.assign({}, config.options, {
    path: `/oss/v2/buckets/${req.params["bucketKey"]}`,
    method: 'DELETE'
  });
  httpClient.makeHttpRequest(options)
    .then(function(bucketsRes) {
      httpClient.sendResponseBasedOnIncomingMessage(res, bucketsRes);
    })
    .catch(function(err) {
      httpClient.respondWithError(res, err);
    });
});

router.get('/buckets/:bucketKey/objects', function(req, res) {
  const options = Object.assign({}, config.options, {
    path: `/oss/v2/buckets/${req.params["bucketKey"]}/objects`,
    method: 'GET'
  });
  httpClient.makeHttpRequest(options)
    .then(function(objectsRes) {
      httpClient.sendResponseBasedOnIncomingMessage(res, objectsRes);
    })
    .catch(function(err) {
      httpClient.respondWithError(res, err);
    });
});

router
  .get('/buckets/:bucketKey/objects/:objectName', function(req, res) {
    const options = Object.assign({}, config.options, {
      path: `/oss/v2/buckets/${req.params["bucketKey"]}/`
        + `objects/${req.params["objectName"]}`,
      method: 'GET'
    });
    httpClient.makeHttpRequest(options)
      .then(function(objectsRes) {
        httpClient.sendResponseBasedOnIncomingMessage(res, objectsRes);
      })
      .catch(function(err) {
        httpClient.respondWithError(res, err);
      });
  })
  .post('/buckets/:bucketKey/objects/:objectName',
        upload.single('file'), function(req, res) {
          const options = Object.assign({}, config.options, {
            path: `/oss/v2/buckets/${req.params["bucketKey"]}/`
              + `objects/${req.params["objectName"]}`,
            method: 'PUT'
          });
          Object.assign(options.headers, {
            'Content-Type': req.file.mimetype,
            'Content-Length': req.file.size
          });
          httpClient.makeHttpRequest(options, req.file.buffer)
            .then(function(uploadRes) {
              httpClient.sendResponseBasedOnIncomingMessage(res, uploadRes);
            })
            .catch(function(err) {
              httpClient.respondWithError(res, err);
            });
        })
  .post('/buckets/:bucketKey/objects/:objectName/resumable', function(req, res) {
    const bb = busboy({ headers: req.headers });
    const fileSize = req.get('Content-Length');
    bb.on('file', (name, file, info) => {
      console.log(`File: ${name} ${file} ${info}`);
      let uploaded = 0;
      let block = '';
      file.on('data', (chunk) => {
        if (block.length >= 5 * 1024 * 1024) {
          console.log(`uploading ${uploaded}-${uploaded + block.length - 1}/${fileSize}`);
          uploaded += block.length;
          block = '';
        } else {
          block += chunk;
        }
        //console.log('chunk: ' + chunk.length);
      });
      file.on('end', () => {
        if (block.length) {
          console.log(`uploading ${uploaded}-${fileSize - 1}/${fileSize}`);
        }
        console.log('done uploading the file');
      });
      file.resume();
    });
    bb.on('field', (name, value, info) => {
      console.log(`Field: ${name} ${value} ${info}`);
    });
    bb.on('finish', () => {
      res.writeHeader(200, { 'Connection': 'close' });
      res.end();
    });
    req.pipe(bb);
  })
  .delete('/buckets/:bucketKey/objects/:objectName', function(req, res) {
    const options = Object.assign({}, config.options, {
      path: `/oss/v2/buckets/${req.params["bucketKey"]}/`
        + `objects/${req.params["objectName"]}`,
      method: 'DELETE'
    });
    httpClient.makeHttpRequest(options)
      .then(function(uploadRes) {
        httpClient.sendResponseBasedOnIncomingMessage(res, uploadRes);
      })
      .catch(function(err) {
        httpClient.respondWithError(res, err);
      });
  })

router
  .get('/buckets/:bucketKey/objects/:objectKey/details', function(req, res) {
    const options = Object.assign({}, config.options, {
      path: `/oss/v2/buckets/${req.params["bucketKey"]}/objects`
        + `/${req.params["objectKey"]}/details`,
      method: 'GET'
    });
    httpClient.makeHttpRequest(options)
      .then(function(objectsRes) {
        httpClient.sendResponseBasedOnIncomingMessage(res, objectsRes);
      })
      .catch(function(err) {
        httpClient.respondWithError(res, err);
      });
  });

module.exports = router;
