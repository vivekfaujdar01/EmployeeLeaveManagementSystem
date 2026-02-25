import Leave from '../models/Leave.js';

// @desc  Apply for leave (employee/manager)
// @route POST /api/leaves
export const applyLeave = async (req, res) => {
    const { leaveType, startDate, endDate, reason } = req.body;

    const startObj = new Date(startDate);
    const endObj = new Date(endDate);

    if (isNaN(startObj.getTime()) || isNaN(endObj.getTime())) {
        return res.status(400).json({ message: 'Invalid date format provided for start or end date' });
    }

    // Check if start date is in the past (ignoring time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDateOnly = new Date(startObj);
    startDateOnly.setHours(0, 0, 0, 0);

    if (startDateOnly < today) {
        return res.status(400).json({ message: 'Start date cannot be in the past' });
    }

    if (endObj < startObj) {
        return res.status(400).json({ message: 'End date cannot be before start date' });
    }
    const leave = await Leave.create({
        employeeId: req.user._id,
        leaveType,
        startDate,
        endDate,
        reason,
    });
    await leave.populate('employeeId', 'name email department');
    res.status(201).json(leave);
};

// @desc  Get my leaves (employee)
// @route GET /api/leaves/my
export const getMyLeaves = async (req, res) => {
    const leaves = await Leave.find({ employeeId: req.user._id })
        .populate('approvedBy', 'name')
        .sort({ createdAt: -1 });
    res.json(leaves);
};

// @desc  Get pending leaves (manager/admin)
// @route GET /api/leaves/pending
export const getPendingLeaves = async (req, res) => {
    const leaves = await Leave.find({
        status: 'pending',
        employeeId: { $ne: req.user._id } // Exclude manager's own leaves
    })
        .populate('employeeId', 'name email department')
        .sort({ createdAt: -1 });
    res.json(leaves);
};

// @desc  Get all leaves (admin)
// @route GET /api/leaves
export const getAllLeaves = async (req, res) => {
    const leaves = await Leave.find()
        .populate('employeeId', 'name email department')
        .populate('approvedBy', 'name')
        .sort({ createdAt: -1 });
    res.json(leaves);
};

// @desc  Approve leave (manager/admin)
// @route PUT /api/leaves/:id/approve
export const approveLeave = async (req, res) => {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    if (leave.employeeId.toString() === req.user._id.toString()) {
        return res.status(403).json({ message: 'You cannot approve your own leave' });
    }
    leave.status = 'approved';
    leave.approvedBy = req.user._id;
    leave.managerNote = req.body.managerNote || '';
    await leave.save();
    await leave.populate('employeeId', 'name email department');
    await leave.populate('approvedBy', 'name');
    res.json(leave);
};

// @desc  Reject leave (manager/admin)
// @route PUT /api/leaves/:id/reject
export const rejectLeave = async (req, res) => {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    if (leave.employeeId.toString() === req.user._id.toString()) {
        return res.status(403).json({ message: 'You cannot reject your own leave' });
    }
    leave.status = 'rejected';
    leave.approvedBy = req.user._id;
    leave.managerNote = req.body.managerNote || '';
    await leave.save();
    await leave.populate('employeeId', 'name email department');
    await leave.populate('approvedBy', 'name');
    res.json(leave);
};

// @desc  Cancel own pending leave
// @route DELETE /api/leaves/:id
export const cancelLeave = async (req, res) => {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    if (leave.employeeId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to cancel this leave' });
    }
    if (leave.status !== 'pending') {
        return res.status(400).json({ message: 'Only pending leaves can be cancelled' });
    }
    await leave.deleteOne();
    res.json({ message: 'Leave cancelled successfully' });
};
