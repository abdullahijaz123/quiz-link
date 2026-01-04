const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const checkRole = require('../middlewares/roleMiddleware');
const authenticateJwt = require('../middlewares/authMiddleware');

// @route   POST api/quizzes/create
// @desc    Create a quiz (Teacher only)
// @access  Private
router.post('/create',
    authenticateJwt,
    checkRole(['teacher', 'admin']),
    quizController.createQuiz
);

// @route   DELETE api/quizzes/delete/:id
// @desc    Delete a quiz (Teacher/Admin)
// @access  Private
router.delete('/delete/:id',
    authenticateJwt,
    checkRole(['teacher', 'admin']),
    quizController.deleteQuiz
);

// @route   POST api/quizzes/assign
// @desc    Assign quiz to student (Teacher only)
// @access  Private
router.post('/assign',
    authenticateJwt,
    checkRole(['teacher', 'admin']),
    quizController.assignQuiz
);

module.exports = router;
