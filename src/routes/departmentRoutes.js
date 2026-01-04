const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// @route   GET api/departments
// @desc    Get all departments
// @access  Public
router.get('/', departmentController.getAllDepartments);

module.exports = router;
