import express from 'express';
import {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  addPayment,
  sendReminder
} from '../controllers/invoiceController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getInvoices)
  .post(authorize('admin', 'technician'), createInvoice);

router.route('/:id')
  .get(getInvoice)
  .put(authorize('admin', 'technician'), updateInvoice)
  .delete(authorize('admin'), deleteInvoice);

router.post('/:id/payments', authorize('admin', 'technician'), addPayment);
router.post('/:id/remind', authorize('admin', 'technician'), sendReminder);

export default router;
