const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Register a new student
// @access  Public
router.post('/register', authController.registerStudent);

// @route   POST api/auth/login
// @desc    Login user (Admin, Teacher, Student)
// @access  Public
router.post('/login', authController.login);

module.exports = router;
