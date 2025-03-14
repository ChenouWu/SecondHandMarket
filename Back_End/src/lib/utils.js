const jwt = require('jsonwebtoken');

const generateToken = (userId, res) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });

    res.cookie("jwt", token, {
        httpOnly: true,  // **阻止前端 JS 访问 Cookie**
        secure: true,    // **仅在 HTTPS 传输（Render 托管需要）**
        sameSite: "None", // **允许跨域携带 Cookie**
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 天过期
    });
};
module.exports = generateToken;