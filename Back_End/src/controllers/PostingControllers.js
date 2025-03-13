const Posting = require('../models/Posting');
const cloudinary = require('../lib/cloudinary');

const createPost = async (req, res) => {
    const { title, description, images, contactInfo, category } = req.body;
    const userId = req.user._id;

    if (!title || !description || !contactInfo) {
        return res.status(400).json({ message: "Title, description and contact info are required." });
    }

    try {
        // ✅ 遍历images，每个都上传到Cloudinary
        const imageUrls = [];
        if (images && images.length > 0) {
            for (const base64Image of images) {
                const uploadResponse = await cloudinary.uploader.upload(base64Image);
                imageUrls.push(uploadResponse.secure_url);
            }
        }

        const newPost = await Posting.create({
            title,
            description,
            images: imageUrls,
            contactInfo,
            category,
            createdBy: userId
        });

        res.status(201).json({
            message: "Post created successfully.",
            post: newPost
        });

    } catch (err) {
        console.error("Post creation error:", err);
        res.status(500).json({ message: "Server error." });
    }
};



const getAllPosts = async (req, res) => {
    try {
        const posts = await Posting.find().populate('createdBy', 'FullName ProfilePic Email');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
};

const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Posting.findById(id).populate('createdBy', 'FullName ProfilePic Email');
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ message: "Server error." });
    }
};

module.exports= {createPost,getPostById,getAllPosts}
