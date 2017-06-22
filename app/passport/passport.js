var FaccebookStrategy  = require('passport-facebook').Strategy;
var User               = require('../models/user;');
var session            = require('express-session');

module.exports=function (app,passport) {


    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.session({secret:'keyboard cat'}));

        }
        passport.serializeUser(function (user,done) {
        done(null,user.id );
        });
    passport.deserializeUser(function (id,done) {
        User.findById(id,function (err,user) {
            done(err,user);
        });
        });

passport.use(new FacebookStrategy({
        clientID: '313983899013671',
        clientSecret: 'a2a72a62807cfc0dc6b31a8108804390',
        callbackURL: "http://localhost:8080/auth/facebook/callback"
        profileFields:['id','displayName','photos','email']
    },
    function(accessToken, refreshToken, profile, done) {
        //User.findOrCreate(..., function(err, user) {
           // if (err) { return done(err); }
         //   done(null, user);
       // });
        done(null, profile);
    }
));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/',failureRedirect: '/login' }));

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
    return passport;


}