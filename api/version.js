const path = require('path');
const { version } = require(path.join(__dirname, '..', 'package.json'));

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    return res.json({ success: false, error: 'Method not allowed' });
  }

  return res.status(200).json({
    success: true,
    version,
    name: 'arwen-blessing',
    environment: process.env.NODE_ENV || 'development'
  });
};