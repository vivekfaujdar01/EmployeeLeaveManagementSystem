import mongoose from 'mongoose';

const reimbursementSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: { type: String, required: true },
        amount: { type: Number, required: true, min: 0 },
        category: {
            type: String,
            enum: ['Travel', 'Food', 'Medical', 'Other'],
            required: true,
        },
        description: { type: String, default: '' },
        billImage: { type: String, default: null }, // filename in uploads/
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        managerNote: { type: String, default: '' },
    },
    { timestamps: true }
);

const Reimbursement = mongoose.model('Reimbursement', reimbursementSchema);
export default Reimbursement;
