import express from 'express';
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addAddress
} from '../controllers/customerController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCustomers)
  .post(authorize('admin', 'technician'), createCustomer);

router.route('/:id')
  .get(getCustomer)
  .put(authorize('admin', 'technician'), updateCustomer)
  .delete(authorize('admin'), deleteCustomer);

router.post('/:id/addresses', authorize('admin', 'technician'), addAddress);

export default router;
