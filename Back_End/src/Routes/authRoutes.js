const express = require('express');
const router = express.Router();
const {signup,login,logout,updateProfile,checkAuth} = require('../controllers/userControllers');
const protectRoute = require('../MiddleWare/auth.middleware');

router.post('/signup',signup);

router.post('/login',login);

router.post('/logout',logout);

router.put('/updateProfile',protectRoute,updateProfile);

router.get('/check',protectRoute,checkAuth);

module.exports = router;
