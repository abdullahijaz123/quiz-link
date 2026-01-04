const User = require('../models/User');
const Department = require('../models/Department');

exports.addTeacher = async (req, res) => {
    const { name, email, password, departmentId } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    try {
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const newTeacher = new User({
            name,
            email,
            password,
            role: 'teacher'
        });

        // Optional Department Assignment
        if (departmentId) {
            const department = await Department.findById(departmentId);
            if (!department) {
                return res.status(400).json({ msg: 'Invalid Department ID' });
            }
            newTeacher.department = departmentId;
        }

        await newTeacher.save();

        res.status(201).json({
            msg: 'Teacher created successfully',
            user: {
                id: newTeacher.id,
                name: newTeacher.name,
                email: newTeacher.email,
                role: newTeacher.role,
                department: departmentId || null
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        const teacher = await User.findById(req.params.id);

        if (!teacher) {
            return res.status(404).json({ msg: 'Teacher not found' });
        }

        if (teacher.role !== 'teacher') {
            return res.status(400).json({ msg: 'User is not a teacher' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Teacher removed' });
    } catch (err) {
        console.error(err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Teacher not found' });
        }
        res.status(500).send('Server Error');
    }
};
