const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const checkRole = require('../middlewares/roleMiddleware');

// @route   POST api/users/teacher/add
// @desc    Add a teacher (Admin only)
// @access  Private (Admin)
router.post('/teacher/add',
    passport.authenticate('jwt', { session: false }),
    checkRole(['admin']),
    userController.addTeacher
);

// @route   DELETE api/users/teacher/delete/:id
// @desc    Delete a teacher (Admin only)
// @access  Private (Admin)
router.delete('/teacher/delete/:id',
    passport.authenticate('jwt', { session: false }),
    checkRole(['admin']),
    userController.deleteTeacher
);

module.exports = router;
