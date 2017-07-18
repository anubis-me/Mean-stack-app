angular.module('userservices',[])
.factory('user',function ($http) {
    var userfactory={};

    userfactory.create=function(regdata){
        return $http.post('/api/users',regdata);
    }

   // User.checkUsername(regdata);

    userfactory.checkUsername=function(regdata){
        return $http.post('/api/checkusername',regdata);
    }

    //User.checkEmail(regdata);

    userfactory.checkEmail=function(regdata){
        return $http.post('/api/checkemail',regdata);
    }
    return userfactory;

});