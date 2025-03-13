const jwt = require('jsonwebtoken');

const generateToken = (userId,res) => {
    const token = jwt.sign({userId},process.env.JWTKEY,{ expiresIn: "7d"})

    res.cookie('jwt',token,{
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'development' ? true : false
    });
    return token;
}

module.exports = generateToken;