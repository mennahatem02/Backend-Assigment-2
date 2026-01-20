function roleMiddleware(...roles) {
    return function name(req, res, next) {
        const role = req.user.role;
        if(!role){
            return res.status(401).json({message: ' Unauthorized User' });
        }
        const isMatch = roles.includes(role);
        if(!isMatch){
            return res.status(403).json({message: 'Forbidden Access' });
        }
        next();
    };
}

module.exports = { roleMiddleware };