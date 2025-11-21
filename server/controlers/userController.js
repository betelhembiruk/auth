import userModel from "../models/userModel.js";

export const getUserdata = async (req, res) => {
    try {
        const user = req.user; 

        if (!user) {
            return res.json({ success: false, message: 'user does not exist' });
        }

        return res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
            }
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
