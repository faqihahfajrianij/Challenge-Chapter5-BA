const express = require('express');
const passport = require('passport');
const router = express.Router();
const authControllers = require('../controllers/auth.controllers');
const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = process.env;


router.post('/register', authControllers.register);
router.post('/login', authControllers.login);
router.get('/whoami', restrict, whoami);

router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    const user = req.user;
    const token = jwt.sign({id: user.id}, JWT_SECRET_KEY);
    res.json({user, token});
});

router.get('/logout', (req, res) =>{
    req.logout();
    res.redirect('/');
});

module.exports = router;