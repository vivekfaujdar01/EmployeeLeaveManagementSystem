import User from '../models/User.js';
import Leave from '../models/Leave.js';
import Reimbursement from '../models/Reimbursement.js';
import fs from 'fs';
import path from 'path';
import { generateToken } from '../config/jwt.js';

// @desc  Check user role by email
// @route POST /api/auth/check-email
export const checkEmailRole = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json({ role: user.role });
};

// @desc  Register user
// @route POST /api/auth/register
export const register = async (req, res) => {
    const { name, email, password, role, department, adminSecret } = req.body;

    // Verify admin secret if user is trying to register as admin
    if (role === 'admin') {
        const expectedSecret = process.env.ADMIN_SECRET_KEY;
        if (!expectedSecret || adminSecret !== expectedSecret) {
            return res.status(403).json({ message: 'Invalid or missing admin secret key' });
        }
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'Email already registered' });
    }
    const user = await User.create({ name, email, password, role, department });
    const token = generateToken(user._id);
    res.status(201).json({
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, department: user.department },
    });
};

// @desc  Login user
// @route POST /api/auth/login
export const login = async (req, res) => {
    const { email, password, adminSecret } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.role === 'admin') {
        const expectedSecret = process.env.ADMIN_SECRET_KEY;
        if (!expectedSecret || adminSecret !== expectedSecret) {
            return res.status(403).json({ message: 'Invalid or missing admin secret key' });
        }
    }

    const token = generateToken(user._id);
    res.json({
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, department: user.department },
    });
};

// @desc  Get current user
// @route GET /api/auth/me
export const getMe = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
};

// @desc  Get all users (admin)
// @route GET /api/auth/users
export const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
};

// @desc  Update user role/department/name (admin)
// @route PUT /api/auth/users/:id
export const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { name, role, department } = req.body;
    if (name) user.name = name;
    if (role) user.role = role;
    if (department !== undefined) user.department = department;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, department: user.department });
};

// @desc  Delete user (admin)
// @route DELETE /api/auth/users/:id
export const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Cascading delete: Find user's reimbursements to delete physical files
    const reimbursements = await Reimbursement.find({ employeeId: user._id });
    for (const reimb of reimbursements) {
        if (reimb.billImage) {
            try {
                const filePath = path.join(process.cwd(), 'uploads', reimb.billImage);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (error) {
                console.error(`Error deleting bill image for reimbursement ${reimb._id}:`, error);
            }
        }
    }

    // Delete associated records in DB
    await Reimbursement.deleteMany({ employeeId: user._id });
    await Leave.deleteMany({ employeeId: user._id });

    // Finally delete the user
    await user.deleteOne();
    res.json({ message: 'User and all associated records removed' });
};
