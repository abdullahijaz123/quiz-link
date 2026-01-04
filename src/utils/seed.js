const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Department = require('../models/Department');
const connectDB = require('../config/db');

dotenv.config();

// Connect to DB
connectDB();

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Department.deleteMany();
        console.log('Data Destroyed...');

        // Seed Departments
        const departments = await Department.insertMany([
            { name: 'Computer Science', code: 'CS' },
            { name: 'Mathematics', code: 'MATH' },
            { name: 'Physics', code: 'PHY' },
            { name: 'Chemistry', code: 'CHEM' }
        ]);
        console.log('Departments Seeded');

        // Seed Admin
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@quizlink.com',
            password: 'adminpassword', // Will be hashed by pre-save hook
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin User Seeded');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
