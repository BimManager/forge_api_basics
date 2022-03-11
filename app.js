const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

const express = require('express');

const authRouter = require('./routes/api/forge/auth/auth');
const dataRouter = require('./routes/api/forge/oss/dataManagement');
const modelRouter = require('./routes/api/forge/modelderivative/modelDerivative');

{
  let errorMessage = ' is not defined.';
  if (!process.env.FORGE_CLIENT_ID) {
    errorMessage = 'FORGE_CLIENT_ID' + errorMessage;
  } else if (!process.env.FORGE_CLIENT_SECRET) {
    errorMessage = 'FORGE_CLIENT_SECRET' + errorMessage;
  }
  if (errorMessage[0] !== ' ') {
    console.error(errorMessage);
    process.exit(1);
  }
}

global.__basedir = __dirname;

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Powered-By', 'Magic');
  next();
});

app.get('/', function(req, res) {
  res.json({ info: 'the server is up' });
});

app.use('/api/forge/auth', authRouter);
app.use('/api/forge/oss', authRouter.authWith2LeggedToken, dataRouter);
app.use('/api/forge/modelderivative', authRouter.authWith2LeggedToken, modelRouter);

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    status: res.status,
    errorMessage: err.message
  });
});

const server = http.createServer(app);
server.listen(app.get('port'), function() {
  console.info('The server is listening on port ' + app.get('port'));
});
