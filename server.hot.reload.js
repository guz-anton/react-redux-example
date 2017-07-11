/* eslint no-console:0 */
/* eslint consistent-return:0 */
const path          = require('path');
const webpack       = require('webpack');
const express       = require('express');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const config        = require('./webpack.hot.reload.config');
const jwt           = require('jwt-simple');
const bodyParser    = require('body-parser');

const JWT_SECRET = 'JWT_SECRET';
const app       = express();

const compiler  = webpack(config);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json());


app.use(devMiddleware(compiler, {
  publicPath: config.output.publicPath,
  historyApiFallback: true
}));

app.use(hotMiddleware(compiler));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/sessions/create', (req, res) => {
    const name = req.body.username;
    const token = jwt.encode({username: name}, JWT_SECRET)

    res.send({
        'id_token': name,
        'access_token': token
    })
});

app.listen(3000, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Listening at http://localhost:3000/');
});
