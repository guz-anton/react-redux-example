// @flow weak

'use strict';

const express   = require('express');
const path      = require('path');
const jwt       = require('jwt-simple');
const JWT_SECRET = 'JWT_SECRET';

const app       = express();
const DOCS_PATH = '../../docs/';
const PORT      = 8082;
const IP_ADRESS = 'localhost';

app.set('port', PORT);
app.set('ipAdress', IP_ADRESS);

app.use(express.static(path.join(__dirname, DOCS_PATH)));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, DOCS_PATH, 'index.html')));
app.get('/sessions/create', (req, res) => {
    var token = jwt.encode({}, JWT_SECRET);

    console.log(req);
    console.log(token);

    res.sendFile(path.join(__dirname, DOCS_PATH, 'index.html'))
});

/* eslint-disable no-console */
app.listen(
  PORT,
  IP_ADRESS,
  () => console.log(`
    ==============================================
    -> Server 🏃 (running) on ${IP_ADRESS}:${PORT}
    ==============================================
  `)
);
/* eslint-enable no-console */
