const express = require('express');
const {createPost,getAllPosts,getPostById} = require('../controllers/PostingControllers');
const protectRoute = require('../MiddleWare/auth.middleware');
const router = express.Router();

router.post('/createposting',protectRoute,createPost)

router.get('/getAllPost',getAllPosts);

router.get(`/getPostById/:id`,protectRoute,getPostById);

module.exports = router
