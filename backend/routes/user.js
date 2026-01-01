import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// ✅ GET /api/user/profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');  // Exclude password
    
    res.json(user);  // ✅ Returns ALL preferences
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
