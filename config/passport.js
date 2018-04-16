const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('./database');

module.exports = function(passport){

  let opts = {};

  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken('jwt');
  opts.secretOrKey = config.secret;
     console.log(opts);
  passport.use(new JwtStrategy(opts, function(jwt_payload, done){
    console.log(jwt_payload.data._id);
      User.getUserByUsername(jwt_payload.data._id, (err, user)=>{
        if(err){
          return done(err, false);
        }
          if(user){
            return done(null, user);
          }else{
            return done(null, false);
          }

      });
  }));


}
