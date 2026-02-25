import express from 'express';
import {
    applyLeave,
    getMyLeaves,
    getPendingLeaves,
    getAllLeaves,
    approveLeave,
    rejectLeave,
    cancelLeave,
} from '../controllers/leaveController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('employee', 'manager'), applyLeave);
router.get('/my', protect, getMyLeaves);
router.get('/pending', protect, authorize('manager', 'admin'), getPendingLeaves);
router.get('/', protect, authorize('admin'), getAllLeaves);
router.put('/:id/approve', protect, authorize('manager', 'admin'), approveLeave);
router.put('/:id/reject', protect, authorize('manager', 'admin'), rejectLeave);
router.delete('/:id', protect, cancelLeave);

export default router;
