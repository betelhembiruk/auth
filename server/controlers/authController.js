import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ success: false, message: 'missing details' });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'user already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: newUser.email,
            subject: 'Welcome to Our Platform',
            text: `Hello ${newUser.name},\n\nThank you for registering on our platform! We're excited to have you on board.\n\nBest regards,\nThe Team.\nYour account has been created with email id: ${newUser.email}`,
        };
        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'registration successful' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: 'missing details' });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'user does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ success: true, message: 'login successful' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export const logout = async (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: 'logout successful' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export const sendVerifyOtp = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { email } = req.body;
        if (!email) return res.json({ success: false, message: 'Email is required' });

        const user = await userModel.findOne({ email: email });
        console.log('User object:', user);

        if (!user) return res.json({ success: false, message: 'User not found' });
        console.log('User email:', user.email);

        if (user.isAccountVerified) {
            return res.json({ success: false, message: 'Account Already Verified' });
        }

       
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        console.log(`Generated OTP for user ${user.email}: ${otp}`);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP for account verification is: ${otp}. It is valid for 10 minutes.`,
        };

        try {
            console.log('About to send OTP email...');
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sendMail() executed:', info.response);
            return res.json({ success: true, message: 'OTP sent to your email' });
        } catch (error) {
            console.error('Failed to send OTP email:', error);
            return res.json({ success: false, message: 'Failed to send OTP email' });
        }

    } catch (error) {
        console.error('sendVerifyOtp error:', error);
        return res.json({ success: false, message: error.message });
    }
};


export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        return res.json({ success: false, message: 'missing details' });
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'user does not exist' });
        }

        if (user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'invalid OTP' });
        }

        if (Date.now() > user.verifyOtpExpireAt) {
            return res.json({ success: false, message: 'OTP expired' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = null;
        user.verifyOtpExpireAt = null;
        await user.save();

        return res.json({ success: true, message: 'account verified successfully' });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    } 
};
