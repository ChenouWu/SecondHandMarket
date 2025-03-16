const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protectRoute = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({ message: "No authentication token" });
        }

        // 验证令牌
        const decoded = jwt.verify(token, process.env.JWTKEY);
        
        // 查找用户
        const user = await User.findById(decoded.id || decoded.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 将用户信息添加到请求对象
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = protectRoute;