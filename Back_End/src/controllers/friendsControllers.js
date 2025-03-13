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
    const userId = req.user._id;

    try {
        const user = await User.findById(userId).populate('Friends', 'FullName ProfilePic Email');

        res.status(200).json({
            message: "Friends list retrieved successfully.",
            friends: user.Friends
        });

    } catch (err) {
        console.error("Get Friends Error:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { getFriends, addFriend };
