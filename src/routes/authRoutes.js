const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateJwt = require('../middlewares/authMiddleware');

// @route   POST api/auth/register
// @desc    Register a new student
// @access  Public
router.post('/register', authController.registerStudent);

// @route   POST api/auth/login
// @desc    Login user (Admin, Teacher, Student)
// @access  Public
router.post('/login', authController.login);

// @route   POST api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticateJwt, authController.logout);

module.exports = router;
