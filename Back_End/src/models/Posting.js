const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    createdAt: { type: Date, default: Date.now },
    replies: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now }
    }]
})

const PostingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    images: {
        type: [String],  // 存放图片链接（Cloudinary返回的secure_url）
        default: []
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contactInfo: {
        type: String,
        required: true  // 联系方式（手机号/微信/邮箱等）
    },
    category: {
        type: String,
        enum: ['For Sale', 'Looking For', 'Ride Share', 'Friendship', 'Others'],
        default: 'Others'
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    comments: [
        CommentSchema
    ]
}, { timestamps: true });  // 自动生成createdAt和updatedAt

const Posting = mongoose.model('Posting', PostingSchema);
module.exports = Posting;
