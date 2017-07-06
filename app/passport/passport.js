var FacebookStrategy  = require('passport-facebook').Strategy;
var TwitterStrategy   = require('passport-twitter').Strategy;
var User               = require('../models/user');
var session            = require('express-session');
var jwt                = require('jsonwebtoken');
var secret             = 'harry';
var GoogleStrategy     = require('passport-google-oauth').OAuth2Strategy;



module.exports=function (app,passport) {

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({secret:'keyboard cat', resave:false, saveUninitialized:true, cookie:{secure:false}}));


        passport.serializeUser(function (user,done) {
            token = jwt.sign({username:user.username, email:user.email}, secret,{expiresIn:'24h'});
            done(null,user.id);
        });
        passport.deserializeUser(function (id,done) {
        User.findById(id,function (err,user) {
            done(err,user);
        });
        });

passport.use(new FacebookStrategy({
        clientID: '313983899013671',
        clientSecret: 'a2a72a62807cfc0dc6b31a8108804390',
        callbackURL: "http://localhost:8080/auth/facebook/callback",
        profileFields:['id','displayName','photos','email']
    },
    function(accessToken, refreshToken, profile, done) {
    console.log(profile._json.email);
    User.findOne({email:profile._json.email}).select('username password email').exec(function (err,user) {
       if(err) done(err);
       if(user && user!=null){
           done(null, user);
       }
       else {
           done(err);
       }
    });
    }
   ));


    passport.use(new TwitterStrategy({
            consumerKey: "GFwWYCeMNTtsk2a9bklZFrhzc",
            consumerSecret: "v3AqTIVYqspJpxr45v9kS8nx1t7DNibC6p6GXChZq3Ih4gh11t",
            callbackURL: "http://localhost:8080/auth/twitter/callback",
            userProfileURL:"https://api.twitter.com/1.1/users/show.json"
        },
        function(token, tokenSecret, profile, done) {
            User.findOne({email:profile.emails[0].value}).select('username password email').exec(function (err,user) {
                if(err) done(err);
                if(user && user!=null){
                    done(null, user);
                }
                else {
                    done(err);
                }
            });
        }
    ));


    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
    passport.use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://www.example.com/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOrCreate({ googleId: profile.id }, function (err, user) {
                return done(err, user);
            });
        }
    ));


    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/twittererror' }),function (req,res) {
        res.redirect('/twitter/'+token);
    });

    app.get('/auth/twitter', passport.authenticate('twitter'));



    app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/facebookerror' }),function (req,res) {
        res.redirect('/facebook/'+token);
    });

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
    return passport;


}