var FacebookStrategy   = require('passport-facebook').Strategy;
var TwitterStrategy    = require('passport-twitter').Strategy;
var User               = require('../models/user');
var session            = require('express-session');
var jwt                = require('jsonwebtoken');
var secret             = 'harry';
var GoogleStrategy     = require('passport-google-oauth').OAuth2Strategy;



module.exports = function(app,passport) {

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
    console.log(profile);
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


    passport.use(new GoogleStrategy({
            clientID: "1072623354876-17e5pg24gkhanmcv5chcosr1jqpd0s1m.apps.googleusercontent.com",
            clientSecret: "iywlCd8I6UBPlwY1LOeYLEz9",
            callbackURL: "http://localhost:8080/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(profile.emails[0].value);
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



    app.get('/auth/google',passport.authenticate('google',{scope:['https://www.googleapis.com/auth/plus.login','profile','email']}));

    app.get('auth/google/callback',passport.authenticate('google',{failureRedirect:'/googleerror'}), function(req,res) {
     res.redirect('/google/'+token);
    });

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