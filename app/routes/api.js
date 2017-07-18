var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'harry';
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');




module.exports = function (router){

  var options = {
        auth: {
            api_user: 'SENDGRID_USERNAME',
            api_key: 'SENDGRID_PASSWORD'
        }
    }

    var client = nodemailer.createTransport(sgTransport(options));

    var email = {
        from: 'awesome@bar.com',
        to: 'mr.walrus@foo.com',
        subject: 'Hello',
        text: 'Hello world',
        html: '<b>Hello world</b>'
    };

    client.sendMail(email, function(err, info){
        if (err ){
            console.log(error);
        }
        else {
            console.log('Message sent: ' + info.response);
        }
    });



    router.post('/users',function (req,res) {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email    = req.body.email;
    user.name     = req.body.name;
    user.temporarytoken=jwt.sign({username:user.username, email:user.email}, secret,{expiresIn:'24h'});

        if (req.body.username==null || req.body.username =='' || req.body.password == '' || req.body.password==null ||
        req.body.email == '' || req.body.email==null ||req.body.name == '' || req.body.name==null) {

        res.json({success:false,message:'Ensure username and email or password were provided'});
    }
    else{
        user.save(function (err) {
            if(err) {

                if (err.errors != null) {
                    if (err.errors.name) {
                        res.json({success: false, message: err.errors.name.message});
                    }
                    else if (err.errors.email) {
                        res.json({success: false, message: err.errors.email.message});
                    }
                    else if (err.errors.username) {
                        res.json({success: false, message: err.errors.username.message});
                    }
                    else if (err.errors.password) {
                        res.json({success: false, message: err.errors.password.message});
                    }
                    else {
                        res.json({success: false, message: err});
                    }
                }
                else if(err){
                    if(err.code==11000){
                        if(err.errMsg[61]=='u'){
                            res.json({success: false, message:"Username already taken"});
                         }
                        else if(err.errMsg[61]=='e'){
                            res.json({success: false, message:"Email already taken"});
                        }
                    }
                    else {
                        res.json({success: false, message: err});
                    }
                }
            }

            else{
                res.json({success:true,message:'Account Registered, Please check your Email for Activation link!'});
            }
        });
    }
  });
    router.post('/checkusername',function (req,res) {
        User.findOne({username:req.body.username}).select('username').exec(function(err,user) {
            if(err) throw err;

            if(user){
                res.json({success:false,message:'Username is already taken'});
            }else {
                res.json({success:true,message:'Unique Username !'});
            }


        });
});
    router.post('/checkemail',function (req,res) {
        User.findOne({email:req.body.email}).select('email').exec(function(err,user) {
            if(err) throw err;

            if(user){
                res.json({success:false,message:'Email is already taken'});
            }else {
                res.json({success:true,message:'Unique Email !'});
            }


    });
});

    router.post('/authenticate',function (req,res) {
        User.findOne({username:req.body.username}).select('email username password').exec(function(err,user) {
            if(err) throw err;
            if(!user){
                res.json({success:false, message:'Could not authenticate user'});
               }
            else if(user){
                 if(req.body.password){
                     var validPassword=user.comparePassword(req.body.password);
                 }
                 else{
                     res.json({success:false,message:'No password provided'});
                 }
                 if(!validPassword) {
                     res.json({success: false, message: 'Password Incorrect'});
                 }
                 else{
                     var token = jwt.sign({username:user.username, email:user.email}, secret,{expiresIn:'24h'});
                     res.json({success:true,message:'User authenticate',token:token});
                 }
            }
        });
    });

    router.use(function (req,res,next) {
        var token = req.body.token||req.body.query||req.headers['x-access-token'];
        if(token){
            jwt.verify(token,secret,function (err,decoded) {
                if(err){
                     res.json({success:false, message:'Token Invalid'});
                }
                else{
                    req.decoded=decoded;
                    next();
                }
            });

        }
        else {
            res.json({success:false,message:'No token provided'});
        }
    });
    
    router.post('/me',function (req,res) {
        res.send(req.decoded);
    });

    return router;
}


