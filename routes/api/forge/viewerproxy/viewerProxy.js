//import { Router } from 'express';
const express = require('express');

const config = require('../../../../config');
const httpClient = require('../../../../helpers/httpClient');

const router = new express.Router();

router.get('/*', function(req, res) {
//  console.log('URL: ' + decodeURIComponent(req.url));
  const options = Object.assign({}, config.options, {
    path: req.path,
    method: req.method
  });

  httpClient.makeHttpRequest(options)
    .then(function(viewerRes) {
       httpClient.sendResponseBasedOnIncomingMessage(res, viewerRes);
    })
    .catch(function(error) {
      console.error(error);
      res.sendStatus(400);
    });
});

module.exports = router;
