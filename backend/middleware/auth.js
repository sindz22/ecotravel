const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('🔑 Token received:', token ? 'YES' : 'NO');
    
    if (!token) return res.status(401).json({ error: 'No token' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ User ID:', decoded.id);
    
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error('❌ Auth error:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};
