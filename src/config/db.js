const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/quiz-link', {
            // Options are generally handled automatically in newer Mongoose versions but keeping it clean
        });
        console.log('MongoDB Connected to quiz-link');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
