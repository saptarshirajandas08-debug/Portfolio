const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'No token provided. Log in again.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = payload.adminId;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expired or invalid. Log in again.' });
  }
}

module.exports = requireAdmin;
