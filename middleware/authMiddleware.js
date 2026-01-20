const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function authMiddleware(req , res , next) {
    const auth = req.headers?.authorization;
    if (!auth) {
        return res.status(401).json({ message: 'Unauthorized User' });
    }
    const[_,token]= auth.split(" ");
    if (!token) {
        return  res.status(401).json({ message: 'Unauthorized User' });
    }

    try {
        const userData = jwt.verify(token , process.env.JWT_SECRET);
        req.user = userData;
        next();
        
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized User' });
    }
    
}

module.exports = { authMiddleware };