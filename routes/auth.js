const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/register' , (req,res)=>{
    res.render('auth/signup');
})

router.post('/register' , async(req,res)=>{
    try{
        let {email,username,password,role} = req.body;
        const user = new User({email,username,role});
        const newUser = await User.register(user,password);
        // res.send(newUser);
        req.login(newUser, function(err) {
            if (err) { return next(err); }
            req.flash('success' , 'Welcome, you are registered successfully')
            return res.redirect('/products');
        });
    }
    catch(e){
        req.flash('error' , e.message);
        return res.redirect('/products');
    }
})

router.get('/login' , (req,res)=>{
    res.render('auth/login');
})
        
    
router.post('/login',
    passport.authenticate('local', { 
       failureRedirect: '/login', 
       failureMessage: true ,
    }),
    function(req, res) {
        // console.log(req.user);
        req.flash('success' , `Welcome back ${req.user.username}`);
        // console.log(req.session);
        res.redirect(`/products`);
    }
);

router.get('/logout',(req,res)=>{
    
    req.logout(()=>{
        req.flash('success' , 'Goodbye friend');
        res.redirect('/login');
    });
        
});

module.exports = router;