const User = require('../models/User');
const Department = require('../models/Department');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Register Student
exports.registerStudent = async (req, res) => {
    const { name, email, password, departmentId } = req.body;

    // Validation
    if (!name || !email || !password || !departmentId) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Check if Department exists
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(400).json({ msg: 'Invalid Department' });
        }

        const newUser = new User({
            name,
            email,
            password,
            department: departmentId,
            role: 'student'
        });

        await newUser.save();

        // Create token
        const payload = { id: newUser.id, name: newUser.name, role: newUser.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: 3600 });

        res.json({
            token: token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                department: department.name
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Login User (Admin, Teacher, Student)
exports.login = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ msg: info.message });

        req.login(user, { session: false }, (err) => {
            if (err) res.send(err);

            // Create token
            const payload = { id: user.id, name: user.name, role: user.role };
            const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: 3600 });

            return res.json({
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        });
    })(req, res, next);
};

// Logout User
exports.logout = (req, res) => {
    // Since we are using stateless JWTs, "logout" is strictly client-side (deleting the token).
    // The server just acknowledges the request.
    res.json({ msg: 'Logged out successfully' });
};
