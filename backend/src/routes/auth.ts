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
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);

export default router;
