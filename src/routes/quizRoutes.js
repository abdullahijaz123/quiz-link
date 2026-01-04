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

// @route   GET api/quizzes/student/pending
// @desc    Get pending quizzes for logged in student
// @access  Private (Student)
router.get('/student/pending',
    authenticateJwt,
    checkRole(['student']),
    quizController.getStudentQuizzes
);

// @route   POST api/quizzes/student/submit
// @desc    Submit a quiz
// @access  Private (Student)
router.post('/student/submit',
    authenticateJwt,
    checkRole(['student']),
    quizController.submitQuiz
);

// @route   GET api/quizzes/results/:quizId
// @desc    Get results for a specific quiz (Teacher only)
// @access  Private (Teacher/Admin)
router.get('/results/:quizId',
    authenticateJwt,
    checkRole(['teacher', 'admin']),
    quizController.getQuizResults
);

module.exports = router;
