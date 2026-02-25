import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    submitReimbursement,
    getMyReimbursements,
    getPendingReimbursements,
    getAllReimbursements,
    approveReimbursement,
    rejectReimbursement,
    cancelReimbursement,
} from '../controllers/reimbursementController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, unique + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        ext && mime ? cb(null, true) : cb(new Error('Only image files are allowed'));
    },
});

const router = express.Router();

router.post('/', protect, authorize('employee', 'manager'), upload.single('billImage'), submitReimbursement);
router.get('/my', protect, getMyReimbursements);
router.get('/pending', protect, authorize('manager', 'admin'), getPendingReimbursements);
router.get('/', protect, authorize('admin'), getAllReimbursements);
router.put('/:id/approve', protect, authorize('manager', 'admin'), approveReimbursement);
router.put('/:id/reject', protect, authorize('manager', 'admin'), rejectReimbursement);
router.delete('/:id', protect, cancelReimbursement);

export default router;
