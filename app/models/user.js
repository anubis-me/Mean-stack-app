var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var bcrypt      = require('bcrypt-nodejs');
var titlize     = require('mongoose-title-case');
var validate    = require('mongoose-validator');

var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([[a-zA-Z]{3,20})+[ ]+([[a-zA-Z]{3,20})+)+$/,
        message  :'Must be atleast 3 Letters maximum 30 and no special characters'
    })
];
var emailValidator =[
    validate({
        validator: 'isEmail',
        message  :'Is not a valid Email'
    }),
    validate({
        validator: 'isEmail',
        arguments:[3,50],
        message  :'Email should be between 3 to 20 letters'

    })
];
var UserSchema = new Schema({
    name:{type: String, required: true, validate:nameValidator},
    username:{type: String, lowercase : true, required: true, unique: true},
    password:{type:String, required:true},
    email:{type: String, required:true, lowercase:true, unique:true}

});

UserSchema.pre('save', function(next){
    var user= this;
    bcrypt.hash(user.password, null, null , function (err,hash){
        if(err) return next(err);
        user.password= hash;
        next();
    });
});

UserSchema.plugin(titlize,{
   path:['name']
});

UserSchema.methods.comparePassword=function (password) {
    return bcrypt.compareSync(password,this.password);
};



module.exports = mongoose.model('User',UserSchema);


