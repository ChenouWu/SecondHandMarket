const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    replies:[{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment:{type:String},
        createdAt:{ type:Date,default:Date.now}
        }
    ]
});

const PostingSchema = new mongoose.Schema({
    title: String,
    description: String,
    images: [String],
    contactInfo: String,
    category: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [CommentSchema],  // 这里嵌套comments
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Posting = mongoose.model("Posting", PostingSchema);
module.exports = Posting;