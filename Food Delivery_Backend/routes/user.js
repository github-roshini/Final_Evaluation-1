const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../schemas/userSchema');

router.post('/register', async (req, res) => {
    const { name, password, phoneNumber, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, password: hashedPassword, phoneNumber, email });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, phoneNumber: user.phoneNumber } });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
