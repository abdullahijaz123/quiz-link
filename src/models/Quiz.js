const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [
        {
            questionText: {
                type: String,
                required: true
            },
            options: [
                {
                    key: { type: String, required: true }, // e.g. "a"
                    text: { type: String, required: true } // e.g. "Option A text"
                }
            ],
            correctAnswer: {
                type: String,
                required: true // e.g. "a"
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quiz', quizSchema);
