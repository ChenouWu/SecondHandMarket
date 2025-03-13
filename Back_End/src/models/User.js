const mongoose = require('mongoose');
const { Schema } = mongoose;
const cloddnariy = require('../lib/cloudinary');
const userSchema = new Schema({
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    FullName:{
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    ProfilePic:{
        type: String,
        default:""
    },
    Friends:[{type: mongoose.Schema.Types.ObjectId,ref:"User"}]
    },{timestamps: true}
); 

module.exports = mongoose.model('User', userSchema);