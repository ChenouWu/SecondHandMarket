const express = require('express');
const protectRoute = require('../MiddleWare/auth.middleware');
const {getFriends, addFriend} = require('../controllers/friendsControllers');
const router = express.Router();


// 获取好友列表
router.get("/getFriends", protectRoute, getFriends);

// 添加好友
router.post("/add", protectRoute, addFriend);




module.exports =router
