const jwt = require('jsonwebtoken');

function auth(optional = false) {
  return (req, res, next) => {
    const header = req.headers.authorization;

    if (!header) {
      if (optional) return next();
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Invalid Authorization header format' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
      req.user = { id: decoded.id };
      next();
    } catch (err) {
      if (optional) return next();
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

module.exports = auth;

