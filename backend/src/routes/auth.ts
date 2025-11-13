import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
  updateDetails,
  updatePassword,
  forgotPassword
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// ENDPOINT DE DEBUG - FORÇA NOVO LOGIN SEM CACHE
router.post('/debug-login', async (req, res) => {
  try {
    const User = (await import('../models/User')).default;
    const { email, password } = req.body;

    console.log('🔧 DEBUG LOGIN - Email:', email);
    console.log('🔧 DEBUG LOGIN - JWT_SECRET:', process.env.JWT_SECRET);

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const jwt = await import('jsonwebtoken');
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'mysecret123',
      { expiresIn: '30d' }
    );

    console.log('🔧 DEBUG LOGIN - Token gerado:', token.substring(0, 50) + '...');

    res.status(200).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('❌ Erro no debug-login:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);

export default router;
