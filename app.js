const express = require('express');
const path = require('path');

const blessingHandler = require('./api/blessing');
const counterHandler = require('./api/counter');
const versionHandler = require('./api/version');

const app = express();
const PORT = process.env.PORT || 3000;
const root = __dirname;

function wrap(handler) {
  return (req, res, next) => {
    try {
      handler(req, res);
    } catch (err) {
      next(err);
    }
  };
}

app.get('/api/blessing', wrap(blessingHandler));
app.get('/api/counter', wrap(counterHandler));
app.get('/api/version', wrap(versionHandler));

app.use(express.static(root));

app.get('*', (req, res) => {
  res.sendFile(path.join(root, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Arwen's Blessing running at http://localhost:${PORT}`);
});
