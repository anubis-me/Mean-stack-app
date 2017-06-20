var User = require('../models/user');

module.exports = function (router){
    router.post('/users',function (req,res) {
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    if (req.body.username==null || req.body.username =='' || req.body.password == '' || req.body.password==null || req.body.email == '' || req.body.email==null) {
        res.send('Ensure provided');
    }
    else{
        user.save(function (err) {
            if(err) {
                res.send("Username or email already exist");
            }
            else{
                res.send('User Created !');
            }
        });
    }
  });

    return router;
}