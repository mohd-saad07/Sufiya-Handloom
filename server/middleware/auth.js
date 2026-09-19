const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication failed: No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'sufia_handloom_secret_key_2026_xyz');
    
    req.adminData = { username: decodedToken.username };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed: Invalid or expired token' });
  }
};
