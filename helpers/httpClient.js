/*  
** const options = {
**    hostname: 'developer.api.autodesk.com',
**    port: 443,
**    method: 'POST',
**    path: '/authentication/v1/authenticate',
**    headers: {
**      'Content-Type': 'application/x-www-form-urlencoded'
**    }
** };
*/

const https = require('https');
const qs = require('querystring');

function _makeHttpRequest(options, body = null) {
  console.log(options);
  if (body) console.log(body);
  return new Promise(function(resolve, reject) {
    const req = https.request(options, function(res) {
      let body = [];
      res.on('data', function(chunk) {
        body.push(chunk);
      });
      res.on('end', function() {
        body = Buffer.concat(body);
        res.body = /text|json/.test(res.headers['content-type'])
          ? body.toString() : body;
        resolve(res);
      });
    });
    req.on('error', function(err) { reject(err); });
    if (body) {
      const contentType = options.headers['Content-Type'];
      if (/.*json.*/.test(contentType)) {
        body = JSON.stringify(body);
      } else if (/.*x-www-form-urlencoded.*/.test(contentType)) {
        body = qs.stringify(body);
      }
      req.write(body);
    }
    req.end();
  });
}

function _sendResponseBasedOnIncomingMessage(response, incomingMessage) {
//  console.log('Content-Type: ' + (incomingMessage.headers["content-type"]
  //                                || 'application/octet-stream'));
  response.statusCode = incomingMessage.statusCode;
  response.set('Content-Type', incomingMessage.headers["content-type"]
               || 'application/octet-stream');
  response.set('Content-Length', incomingMessage.headers["content-length"]);
  response.send(incomingMessage.body);
}

function _respondWithError(response, error) {
  response.statusCode = error && error.statusCode || 500;
  const message = { errorMessage: error && error.message || 'Unknown Error' }
  if (error && error.stack) { console.error(error.stack); }
  response.json(message);
}

module.exports = {
  makeHttpRequest : _makeHttpRequest,
  sendResponseBasedOnIncomingMessage: _sendResponseBasedOnIncomingMessage,
  respondWithError: _respondWithError
};
