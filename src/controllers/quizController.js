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

        // Check for any pending assignment found
        const pendingAssignment = await Assignment.findOne({
            student: studentId,
            status: 'pending'
        });

        if (pendingAssignment) {
            return res.status(400).json({ msg: 'Student already has a pending quiz assignment. Cannot assign another.' });
        }

        // Check if this specific quiz is already assigned (completed or not)
        const existingAssignment = await Assignment.findOne({ quiz: quizId, student: studentId });
        if (existingAssignment) {
            return res.status(400).json({ msg: 'Quiz already assigned to this student', status: existingAssignment.status });
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

// Get Student Quizzes
exports.getStudentQuizzes = async (req, res) => {
    try {
        const assignments = await Assignment.find({ student: req.user.id, status: 'pending' })
            .populate('quiz', 'title description questions');

        // Transform data to remove correct answers
        const quizzes = assignments.map(assignment => {
            const quiz = assignment.quiz;
            return {
                assignmentId: assignment._id,
                quizId: quiz._id,
                title: quiz.title,
                description: quiz.description,
                questions: quiz.questions.map(q => ({
                    _id: q._id,
                    questionText: q.questionText,
                    options: q.options
                }))
            };
        });

        res.json(quizzes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// Submit Quiz
exports.submitQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body; // answers: [{ questionId: "...", selectedKey: "a" }]

        if (!quizId || !Array.isArray(answers)) {
            return res.status(400).json({ msg: 'Please provide quizId and answers array' });
        }

        const assignment = await Assignment.findOne({ quiz: quizId, student: req.user.id, status: 'pending' });
        if (!assignment) {
            return res.status(404).json({ msg: 'No pending assignment found for this quiz' });
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ msg: 'Quiz not found' });
        }

        let correctCount = 0;
        const results = [];

        quiz.questions.forEach(q => {
            const answer = answers.find(a => a.questionId === q._id.toString());
            const isCorrect = answer && answer.selectedKey === q.correctAnswer;

            if (isCorrect) correctCount++;

            results.push({
                questionId: q._id,
                isCorrect,
                correctAnswer: q.correctAnswer,
                selectedKey: answer ? answer.selectedKey : null
            });
        });

        const score = (correctCount / quiz.questions.length) * 100;

        assignment.status = 'completed';
        assignment.score = score;
        assignment.completedAt = Date.now();
        await assignment.save();

        res.json({
            msg: 'Quiz submitted successfully',
            score,
            totalQuestions: quiz.questions.length,
            correctAnswers: correctCount,
            results
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// Get Quiz Results (Teacher)
exports.getQuizResults = async (req, res) => {
    try {
        const { quizId } = req.params;

        // Verify ownership/permission
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ msg: 'Quiz not found' });
        }

        if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not authorized to view results for this quiz' });
        }

        const results = await Assignment.find({ quiz: quizId, status: 'completed' })
            .populate('student', 'name email')
            .select('student score completedAt');

        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};
