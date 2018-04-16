const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

module.exports.getUserByID = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username};
  User.findOne(query, callback);
}

module.exports.addUser= function(newUser, callback){
  bcrypt.genSalt(10, (err, salt)=>{
    bcrypt.hash(newUser.password, salt, (err, hash)=>{
      if(err){console.log('Error adding user');}
       newUser.password = hash;
       newUser.save(callback);
    });
  });
}

 module.exports.comparePassword = function(candidatePassword, hash, callback){
     bcrypt.compare(candidatePassword, hash, (err, isMatch)=>{
       if(err){console.log('Password error at model');}
       callback(null, isMatch);
     });
 }
