const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const passport = require('passport');

router.post('/register', (req, res, next)=>{
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  User.addUser(newUser, (err, user)=>{
     if(err){
       res.json({success: false, msg: 'Registration failed'});
     }else{
       res.json({success: true, msg: 'Registration Successfull'});
     }
  });
});

router.post('/authenticate', (req, res, next)=>{

  const username =  req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user)=>{
    if(err){
      console.log('Error finding user');
    }if(!user){
      console.log('User not found');
    }
    User.comparePassword(password, user.password, (err, isMatch)=>{
      if(err){console.log('Password error');}
      if(isMatch){
        const token = jwt.sign({data:user}, config.secret, {expiresIn: 20000});
        res.json({
          success: true,
          token: 'JWT'+token,
          user:{
            id: user._id,
            name: user.name,
            email: user.email,
            username: user.username
          }
        });
      }else{
        res.json({success: false, msg: 'Authentication failed'});
      }
    });

  });

});

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next)=>{
  res.json({user: req.user});
});

module.exports = router;
