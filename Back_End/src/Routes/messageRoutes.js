const express = require('express');
const protectRoute = require('../MiddleWare/auth.middleware');
const {getUsers,getMessages,sendMessages} = require('../controllers/messageControllers');
const router = express.Router();

router.get('/users',protectRoute,getUsers);

router.get('/:id',protectRoute,getMessages);

router.post('/send/:id',protectRoute,sendMessages);

module.exports = router;