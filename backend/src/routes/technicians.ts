import express from 'express';
import { protect, authorize } from '../middleware/auth';
// Placeholder controllers - implement as needed

const router = express.Router();

router.use(protect);
// router.use(authorize('admin')); // Comentado temporariamente

// GET /api/technicians
router.get('/', async (req, res) => {
  res.json({ success: true, data: [] });
});

// POST /api/technicians
router.post('/', async (req, res) => {
  res.json({ success: true, data: {} });
});

export default router;
