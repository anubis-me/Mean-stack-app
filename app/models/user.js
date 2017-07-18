var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
var bcrypt      = require('bcrypt-nodejs');
var titlize     = require('mongoose-title-case');
var validate    = require('mongoose-validator');

    var nameValidator = [
        validate({
            validator: 'matches',
            arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
            message  :'Name must be atleast 3 Letters maximum 30 and no special characters'
        }),
        validate({
            validator: 'isLength',
            arguments:[3,20],
            message  :'Email should be between {ARGS[0]} and {ARGS[1]} characters'

        })
    ];
    var emailValidator =[
        validate({
            validator: 'isEmail',
            message  :'Is not a valid Email'
        }),
        validate({
            validator: 'isLength',
            arguments:[3,35],
            message  :'Email should be between {ARGS[0]} and {ARGS[1]} characters'

        })
    ];


    var usernameValidator = [
        validate({
            validator: 'isLength',
            arguments:[3,25],
            message  :'Username should be between {ARGS[0]} and {ARGS[1]} characters'

        }),
        validate({
            validator:'isAlphanumeric',
            message:'must contain letters and numbers only'
        })
    ];

    var passwordValidator = [
        validate({
            validator: 'matches',
            arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
            message  :'Password must have alteat one small , one upper case, one numberic and one special character and must be atleast 8 char long.'
        }),
        validate({
            validator: 'isLength',
            arguments:[8,35],
            message  :'Password should be between {ARGS[0]} and {ARGS[1]} characters'

        })
    ];

    var UserSchema = new Schema({
        name            :{type: String, required :true, validate:nameValidator},
        username        :{type: String, lowercase:true, required: true, unique: true, validate:usernameValidator},
        password        :{type: String, required:true,  validate:passwordValidator},
        email           :{type: String, required:true, lowercase:true, unique:true, validate:emailValidator},
        active          :{type: Boolean,required:true, default:false},
        temporarytoken  :{type: String,required:true}

    });

    UserSchema.pre('save', function(next){
        var user= this;
        bcrypt.hash(user.password, null, null , function (err,hash){
            if(err) return next(err);
            user.password= hash;
            next();
        });
    });


    UserSchema.methods.comparePassword=function (password) {
        return bcrypt.compareSync(password,this.password);
    };



module.exports = mongoose.model('User',UserSchema);


