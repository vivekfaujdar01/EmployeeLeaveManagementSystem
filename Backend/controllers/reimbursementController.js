import Reimbursement from '../models/Reimbursement.js';
import fs from 'fs';
import path from 'path';

// @desc  Submit reimbursement (employee)
// @route POST /api/reimbursements
export const submitReimbursement = async (req, res) => {
    const { title, amount, category, description } = req.body;
    const billImage = req.file ? req.file.filename : null;
    const reimbursement = await Reimbursement.create({
        employeeId: req.user._id,
        title,
        amount,
        category,
        description,
        billImage,
    });
    await reimbursement.populate('employeeId', 'name email department');
    res.status(201).json(reimbursement);
};

// @desc  Get my reimbursements (employee)
// @route GET /api/reimbursements/my
export const getMyReimbursements = async (req, res) => {
    const reimbursements = await Reimbursement.find({ employeeId: req.user._id })
        .populate('approvedBy', 'name')
        .sort({ createdAt: -1 });
    res.json(reimbursements);
};

// @desc  Get pending reimbursements (manager/admin)
// @route GET /api/reimbursements/pending
export const getPendingReimbursements = async (req, res) => {
    const reimbursements = await Reimbursement.find({
        status: 'pending',
        employeeId: { $ne: req.user._id } // Exclude manager's own reimbursements
    })
        .populate('employeeId', 'name email department')
        .sort({ createdAt: -1 });
    res.json(reimbursements);
};

// @desc  Get all reimbursements (admin)
// @route GET /api/reimbursements
export const getAllReimbursements = async (req, res) => {
    const reimbursements = await Reimbursement.find()
        .populate('employeeId', 'name email department')
        .populate('approvedBy', 'name')
        .sort({ createdAt: -1 });
    res.json(reimbursements);
};

// @desc  Approve reimbursement (manager/admin)
// @route PUT /api/reimbursements/:id/approve
export const approveReimbursement = async (req, res) => {
    const reimbursement = await Reimbursement.findById(req.params.id);
    if (!reimbursement) return res.status(404).json({ message: 'Reimbursement not found' });
    if (reimbursement.employeeId.toString() === req.user._id.toString()) {
        return res.status(403).json({ message: 'You cannot approve your own reimbursement' });
    }
    reimbursement.status = 'approved';
    reimbursement.approvedBy = req.user._id;
    reimbursement.managerNote = req.body.managerNote || '';
    await reimbursement.save();
    await reimbursement.populate('employeeId', 'name email department');
    await reimbursement.populate('approvedBy', 'name');
    res.json(reimbursement);
};

// @desc  Reject reimbursement (manager/admin)
// @route PUT /api/reimbursements/:id/reject
export const rejectReimbursement = async (req, res) => {
    const reimbursement = await Reimbursement.findById(req.params.id);
    if (!reimbursement) return res.status(404).json({ message: 'Reimbursement not found' });
    if (reimbursement.employeeId.toString() === req.user._id.toString()) {
        return res.status(403).json({ message: 'You cannot reject your own reimbursement' });
    }
    reimbursement.status = 'rejected';
    reimbursement.approvedBy = req.user._id;
    reimbursement.managerNote = req.body.managerNote || '';
    await reimbursement.save();
    await reimbursement.populate('employeeId', 'name email department');
    await reimbursement.populate('approvedBy', 'name');
    res.json(reimbursement);
};

// @desc  Cancel own pending reimbursement (employee)
// @route DELETE /api/reimbursements/:id
export const cancelReimbursement = async (req, res) => {
    const reimbursement = await Reimbursement.findById(req.params.id);
    if (!reimbursement) return res.status(404).json({ message: 'Reimbursement not found' });
    if (reimbursement.employeeId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to cancel this reimbursement' });
    }
    if (reimbursement.status !== 'pending') {
        return res.status(400).json({ message: 'Only pending reimbursements can be cancelled' });
    }

    // Cleanup uploaded bill image from physical storage if it exists
    if (reimbursement.billImage) {
        try {
            const filePath = path.join(process.cwd(), 'uploads', reimbursement.billImage);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error('Error deleting bill image:', error);
            // Non-fatal error, continue with deleting the document
        }
    }

    await reimbursement.deleteOne();
    res.json({ message: 'Reimbursement cancelled successfully' });
};
