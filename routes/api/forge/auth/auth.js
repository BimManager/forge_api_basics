const express = require('express');

const config = require('../../../../config');
const forgeAuth = require('./forgeAuth');

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
  });

module.exports = router;
