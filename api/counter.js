let blessingCounter = 0;

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    return res.json({ success: false, error: 'Method not allowed' });
  }

  return res.status(200).json({
    success: true,
    count: blessingCounter
  });
};