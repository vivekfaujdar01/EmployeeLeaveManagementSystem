export const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Internal Server Error';

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }
    // Mongoose Bad ObjectId or Cast Error
    else if (err.name === 'CastError') {
        statusCode = err.kind === 'ObjectId' ? 404 : 400;
        message = err.kind === 'ObjectId' ? 'Resource not found' : `Invalid format for field: ${err.path}`;
    }
    // MongoDB Duplicate Key Error
    else if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue || {})[0];
        message = field ? `The ${field} is already taken.` : 'Duplicate field value entered.';
    }
    // Multer Upload Error
    else if (err.name === 'MulterError') {
        statusCode = 400;
        message = err.message;
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
