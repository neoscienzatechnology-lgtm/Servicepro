import express from 'express';
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  checkIn,
  checkOut,
  cancelAppointment
} from '../controllers/appointmentController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getAppointments)
  .post(authorize('admin', 'technician'), createAppointment);

router.route('/:id')
  .get(getAppointment)
  .put(authorize('admin', 'technician'), updateAppointment)
  .delete(authorize('admin'), deleteAppointment);

router.post('/:id/checkin', authorize('technician'), checkIn);
router.post('/:id/checkout', authorize('technician'), checkOut);
router.post('/:id/cancel', cancelAppointment);

export default router;
