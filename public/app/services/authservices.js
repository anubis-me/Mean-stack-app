angular.module('authservices',[])

    .factory('auth',function ($http) {
        var authfactory={};

        authfactory.login=function(logindata){
            return $http.post('/api/authenticate',logindata);
        }
        return authfactory;

    });