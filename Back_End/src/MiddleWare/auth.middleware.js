const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protectRoute = async (req, res, next) => {
    try{
      let token = req.cookies.jwt;
      
      if(!token){
          return res.status(401).json({ message: "Unauthorized - No Token Provided " });
      }
        const decoded = jwt.verify(token, process.env.JWTKEY);
        
        if(!decoded){
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }
        const user = await User.findById(decoded.userId).select('-Password');

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }
        req.user = user;
        next();
    }catch(err){
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = protectRoute;