const express = require('express');
const protectRoute  = require('../MiddleWare/auth.middleware');
const { createComment,replyToComment } = require('../controllers/commentsControllers');
const router = express.Router();    

router.post('/comment/:id', protectRoute ,createComment);
router.post('/reply/:postId/:commentId', protectRoute, replyToComment);

module.exports = router;
