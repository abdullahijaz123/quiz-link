const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkRole = require('../middlewares/roleMiddleware');
const authenticateJwt = require('../middlewares/authMiddleware');

// @route   POST api/users/teacher/add
// @desc    Add a teacher (Admin only)
// @access  Private (Admin)
router.post('/teacher/add',
    authenticateJwt,
    checkRole(['admin']),
    userController.addTeacher
);

// @route   DELETE api/users/teacher/delete/:id
// @desc    Delete a teacher (Admin only)
// @access  Private (Admin)
router.delete('/teacher/delete/:id',
    authenticateJwt,
    checkRole(['admin']),
    userController.deleteTeacher
);

module.exports = router;
