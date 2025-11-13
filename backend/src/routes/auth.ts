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

// ENDPOINT DE DEBUG - Same as login but with extra logging and clears old tokens
router.post('/debug-login', async (req, res, next) => {
  try {
    console.log('🔧 DEBUG LOGIN - Starting...');
    console.log('🔧 DEBUG LOGIN - JWT_SECRET:', process.env.JWT_SECRET);
    console.log('🔧 DEBUG LOGIN - Email:', req.body.email);
    
    // Call the regular login function
    await login(req, res, next);
    
  } catch (error: any) {
    console.error('❌ Erro no debug-login:', error);
    res.status(500).json({ 
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
});

router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);

export default router;
