import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ success: false, message: 'authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Not Authorized' });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'invalid token' });
    }
};

export default userAuth;
