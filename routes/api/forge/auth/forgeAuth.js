const https = require('https');
const qs = require('querystring');

const httpClient = require('../../../../helpers/httpClient');

/*
** {
**  token_type: String
**  expires_in: Number (in seconds)
**  access_token: String
** }
*/
function forgeAuth() {
  let _token = null;

  function _get2LeggedToken(credentials) {
    if (_token != null) return Promise.resolve(_token);
    const options = {
      hostname: 'developer.api.autodesk.com',
      port: 443,
      method: 'POST',
      path: '/authentication/v1/authenticate',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    return httpClient.makeHttpRequest(options, qs.stringify(credentials))
      .then(function(res) {
        _token = JSON.parse(res.body);
        setTimeout(function() {
          _token = null
        }, (_token.expires_in - 60) * 1000);
        return Promise.resolve(_token);
      })
      .catch(function(err) {
        return Promise.resolve(err);
      });
  }
  return {
    get2LeggedToken: _get2LeggedToken
  }
}
 
module.exports = forgeAuth();

/*auth.getToken({
    client_id: process.env.FORGE_CLIENT_ID,
    client_secret: process.env.FORGE_CLIENT_SECRET,
    grant_type: 'client_credentials',
    scope: 'data:read data:write'
})
  .then((body) => { console.log(body); })
  .catch((err) => { console.error(err); });*/

