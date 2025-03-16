const jwt = require('jsonwebtoken');

const generateToken = (userId, res) => {

    const token = jwt.sign({ id: userId }, process.env.JWTKEY, {
        expiresIn: "30d",
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    });
    
};

module.exports = generateToken;