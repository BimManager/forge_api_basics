const path = require('path');
const qs = require('querystring');
const express = require('express');

const config = require('../../../../config');
const forgeAuth = require('./forgeAuth');
const httpClient = require('../../../../helpers/httpClient')

const router = express.Router();

//router.use(function(req, res, next) {
router.authWith2LeggedToken = function(req, res, next) {
  forgeAuth.get2LeggedToken(config.credentials)
    .then(function(token) {
      Object.assign(config.options, {
        headers: {
          'Authorization': `Bearer ${token.access_token}`
        }
      });
      req.token = token;
      next();
    })
    .catch(function(err) {
      res.setStatus = 500;
      res.json(err);
    });
}

router.route('/token')
  .get(function(req, res) {
    forgeAuth.get2LeggedToken(config.credentials)
      .then(function(token) {
        res.json(token)
      })
      .catch(function(err) {
        res.setStatus = 500;
        res.json(err);
      });
  })
  .post(function(req, res) {
    debugger;
    const token = req.body;
    console.log(token);
    res.sendStatus(200);
  });

router.route('/threeLeggedAuth')
  .get(function(req, res) {
    res.sendFile(path.join(__basedir, 'public', 'threeLeggedAuth.html'));
  });

router.route('/callback')
  .get(function(req, res) {
    debugger;
    if (req.query.code) {
      exchangeCodeForToken(req.query.code)
        .then((token) => {
          console.log(token);
          res.redirect('/api/forge/auth/threeLeggedAuth');
        });
    } else {
      res.redirect('/api/forge/auth/threeLeggedAuth');
    }
  });


function exchangeCodeForToken(code) {
  const options = Object.assign({}, config.options, {
    path: '/authentication/v1/gettoken',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  const body = Object.assign({}, config.credentials, {
    redirect_uri: 'http://localhost:3000/api/forge/auth/callback',
    grant_type: 'authorization_code',
    code: code
  });
  delete body.scope;
  return httpClient.makeHttpRequest(options, body)
    .then(function(authRes) {
      return authRes.body;
    })
    .catch(function(error) {
      return error;
    });
}

module.exports = router;
