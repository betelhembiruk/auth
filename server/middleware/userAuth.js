import jwt from 'jsonwebtoken';



const userAuth = async (req, res, next) => {

    const{ token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'authentication required' });
    }
    try {

const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

if (tokenDecoded.id) {
    req.body.userId = tokenDecoded.id}
    else {
        return res.json({ success: false, message: 'Not Authorized' });
    }

next();
    }

    catch (error) {
        return res.json({ success: false, message: 'invalid token' });
    }   }




    export default userAuth;