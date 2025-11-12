import express from 'express';
import { protect, authorize } from '../middleware/auth';
// Placeholder controllers - implement as needed

const router = express.Router();

router.use(protect);
// router.use(authorize('admin')); // Liberado acesso para usuarios autenticados

// GET /api/services
router.get('/', async (req, res) => {
  res.json({ success: true, data: [] });
});

// POST /api/services
router.post('/', async (req, res) => {
  res.json({ success: true, data: {} });
});

export default router;
