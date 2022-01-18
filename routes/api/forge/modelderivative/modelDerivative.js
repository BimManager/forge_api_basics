const express = require('express');

const config = require('../../../../config');
const httpClient = require('../../../../helpers/httpClient');

const router = express.Router();

router.get('/formats', function(req, res) {
  const options = Object.assign({}, config.options, {
    path: '/modelderivative/v2/designdata/formats',
    method: 'GET'
  });
  httpClient.makeHttpRequest(options)
    .then(function(formatsRes) {
      httpClient.sendResponseBasedOnIncomingMessage(res, formatsRes);
    })
    .catch(function(err) {
      httpClient.respondWithError(res, err);
    });
});

router.post('/job', function(req, res) {
  const options = Object.assign({}, config.options, {
    path: '/modelderivative/v2/designdata/job',
    method: 'POST',
  });
  Object.assign(options.headers, {
    'Content-Type': 'application/json'
  })
  httpClient.makeHttpRequest(options, JSON.stringify({
    input: {
      urn: Buffer.from(req.body["urn"]).toString('base64')
    },
    output: {
      formats: req.body["formats"]
    }
  }))
    .then(function(jobRes) {
      httpClient.sendResponseBasedOnIncomingMessage(res, jobRes);
    })
    .catch(function(err) {
      httpClient.respondWithError(res, err);
    });
});

router.route('/:urn/manifest/:derivativeurn?')
  .get(function(req, res) {
    console.log(req.params['derivativeurn']);
    const options = Object.assign({}, config.options, {
      path: `/modelderivative/v2/designdata/${req.params["urn"]}/manifest`
        + (req.params['derivativeurn']
           ? `/${encodeURIComponent(req.params['derivativeurn'])}` : ''),
      method: 'GET'
    });
    httpClient.makeHttpRequest(options)
      .then(function(manifestRes) {
        httpClient.sendResponseBasedOnIncomingMessage(res, manifestRes);
      })
      .catch(function(err) {
        httpClient.respondWithError(res, err);
    });
});


router.get('/:urn/thumbnail', function(req, res) {
  const options = Object.assign({}, config.options, {
    path: `/modelderivative/v2/designdata/${req.params["urn"]}/thumbnail`,
    method: 'GET'
  });
  httpClient.makeHttpRequest(options)
    .then(function(thumbnailRes) {
      httpClient.sendResponseBasedOnIncomingMessage(res, thumbnailRes);
    })
    .catch(function(err) {
      httpClient.respondWithError(res, err);
    });
});

router.get('/:urn/metadata/:guid?', function(req, res) {
  const options = Object.assign({}, config.options, {
    path: `/modelderivative/v2/designdata/${req.params["urn"]}/metadata`
      + (req.params.guid ? `/${req.params.guid}` : ''),
    method: 'GET'
  });
  httpClient.makeHttpRequest(options)
    .then(function(metadataRes) {
      httpClient.sendResponseBasedOnIncomingMessage(res, metadataRes);
    })
    .catch(function(err) {
      httpClient.respondWithError(res, err);
    });
});

router.get('/:urn/metadata/:guid/properties', function(req, res) {
  const options = Object.assign({}, config.options, {
    path: `/modelderivative/v2/designdata/${req.params["urn"]}/metadata`
      + `/${req.params.guid}/properties`,
    method: 'GET'
  });
  httpClient.makeHttpRequest(options)
    .then(function(propertiesRes) {
      httpClient.sendResponseBasedOnIncomingMessage(res, propertiesRes);
    })
    .catch(function(err) {
      httpClient.respondWithError(res, err);
    });
});

module.exports = router;
