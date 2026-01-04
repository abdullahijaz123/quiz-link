const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Assignment = require('../models/Assignment');

// Create Quiz
exports.createQuiz = async (req, res) => {
    try {
        const { title, description, departmentId, questions } = req.body;

        if (!title || !departmentId || !questions || questions.length === 0) {
            return res.status(400).json({ msg: 'Please provide all required fields' });
        }

        const newQuiz = new Quiz({
            title,
            description,
            department: departmentId,
            createdBy: req.user.id,
            questions
        });

        await newQuiz.save();
        res.status(201).json({ msg: 'Quiz created successfully', quiz: newQuiz });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// Delete Quiz
exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ msg: 'Quiz not found' });
        }

        // Check if user is the creator or admin
        if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized to delete this quiz' });
        }

        await Quiz.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Quiz removed' });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Quiz not found' });
        }
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// Assign Quiz
exports.assignQuiz = async (req, res) => {
    try {
        const { quizId, studentId } = req.body;

        if (!quizId || !studentId) {
            return res.status(400).json({ msg: 'Please provide quizId and studentId' });
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ msg: 'Quiz not found' });
        }

        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        // Verify Student is in the same department as the Quiz
        if (student.department.toString() !== quiz.department.toString()) {
            return res.status(400).json({ msg: 'Student belongs to a different department' });
        }

        // Check if already assigned
        const existingAssignment = await Assignment.findOne({ quiz: quizId, student: studentId });
        if (existingAssignment) {
            return res.status(400).json({ msg: 'Quiz already assigned to this student' });
        }

        const assignment = new Assignment({
            quiz: quizId,
            student: studentId,
            assignedBy: req.user.id
        });

        await assignment.save();
        res.status(201).json({ msg: 'Quiz assigned successfully', assignment });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};
