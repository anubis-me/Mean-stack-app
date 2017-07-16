var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'harry';

module.exports = function (router){
    router.post('/users',function (req,res) {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email    = req.body.email;
    user.name     = req.body.name;
    if (req.body.username==null || req.body.username =='' || req.body.password == '' || req.body.password==null ||
        req.body.email == '' || req.body.email==null ||req.body.name == '' || req.body.name==null) {

        res.json({success:false,message:'Ensure username and email or password were provided'});
    }
    else{
        user.save(function (err) {
            if(err) {
                if(err.errors.name){
                    res.json({success: false, message:err.errors.name.message});
                }

            }
            else{
                res.json({success:true,message:'User Created !'});
            }
        });
    }
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


