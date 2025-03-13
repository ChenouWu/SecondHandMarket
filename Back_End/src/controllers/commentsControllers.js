const Posting = require('../models/Posting');

const createComment = async (req, res) => {
    const { comment } = req.body;
    const { id: postId } = req.params;
    const userId = req.user._id;
    console.log(comment)
    if (!comment.trim()) {
        return res.status(400).json({ message: "Comment cannot be empty" });
    }

    try {
        const post = await Posting.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newComment = {
            userId,
            comment,
            createdAt: new Date()
        };

    

        if (!post.comments) {
            post.comments = [];  // ✅ 确保 comments 存在
        }

        post.comments.push(newComment);
        await post.save();

        // **填充 `userId` 让前端拿到完整的用户信息**
        const populatedComment = await Posting.findById(postId).populate('comments.userId', 'FullName ProfilePic');

        res.status(201).json(populatedComment.comments[populatedComment.comments.length - 1]);
    } catch (err) {
        console.error("Error creating comment:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const replyToComment = async (req, res) => {
    const { comment } = req.body;
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    if (!comment.trim()) {
        return res.status(400).json({ message: "Reply cannot be empty" });
    }

    try {
        const post = await Posting.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const parentComment = post.comments.id(commentId);
        if (!parentComment) {
            return res.status(404).json({ message: "Parent comment not found" });
        }

        const newReply = {
            userId,
            comment,
            createdAt: new Date()
        };

        parentComment.replies.push(newReply);
        await post.save();

        
        const populatedPost = await Posting.findById(postId)
            .populate("comments.userId", "FullName ProfilePic")
            .populate("comments.replies.userId", "FullName ProfilePic");

        const latestComment = populatedPost.comments.id(commentId);
        res.status(201).json(latestComment.replies[latestComment.replies.length - 1]);
    } catch (err) {
        console.error("Error replying to comment:", err);
        res.status(500).json({ message: "Server error" });
    }
};



module.exports = {createComment,replyToComment};
console.log("✅ Exporting createComment:", typeof createComment);
