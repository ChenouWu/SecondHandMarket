const User = require('../models/User');

const addFriend = async (req, res) => {
    const { FullName } = req.body;  // Friend's name from request body
    const userId = req.user._id;     // Logged-in user's ID

    if (!FullName) {
        return res.status(400).json({ message: "Please provide the friend's name." });
    }

    try {
        const friend = await User.findOne({ FullName });

        if (!friend) {
            return res.status(404).json({ message: "User not found." });
        }

        if (friend._id.toString() === userId.toString()) {
            return res.status(400).json({ message: "You cannot add yourself as a friend." });
        }

        const user = await User.findById(userId);

        // Avoid adding duplicate friends
        if (user.Friends.includes(friend._id)) {
            return res.status(400).json({ message: "This user is already your friend." });
        }

        // Mutual friendship (both users add each other)
        user.Friends.push(friend._id);
        friend.Friends.push(userId);

        await user.save();
        await friend.save();

        res.status(200).json({ message: "Friend added successfully." });

    } catch (err) {
        console.error("Add Friend Error:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

const getFriends = async (req, res) => {
    // ✅ 先检查 req.user 是否存在
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "Unauthorized - No user found in request." });
    }

    const userId = req.user._id;

    try {
        const user = await User.findById(userId).populate('Friends', 'FullName ProfilePic Email');

        // ✅ 这里检查 user 是否为空
        if (!user) {
            return res.status(404).json({ message: "User not found-friendControllers" }); // 👈 这里返回错误
        }

        res.status(200).json({
            message: "Friends list retrieved successfully.",
            friends: user.Friends || [] // 确保 friends 不为空
        });

    } catch (err) {
        console.error("Get Friends Error:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { getFriends, addFriend };
