angular.module('authservices',[])

    .factory('auth',function ($http, AuthToken) {
        var authfactory={};

        authfactory.login=function(logindata){
            return $http.post('/api/authenticate',logindata).then(function (data) {
                AuthToken.setToken(data.data.token);
                return data;
            });
        };
       // auth.isLoggedIn();
        authfactory.isLoggedIn= function () {
            if(AuthToken.getToken()){
                return true;
            }
            else {
                return false;
            }
        };


        authfactory.logout=function () {
        AuthToken.setToken();
        };
        return authfactory;
    })

  .factory('AuthToken',function($window){
      var authtokenfactory ={};

      authtokenfactory.setToken=function(token){
          if(token){
              $window.localStorage.setItem('token',token);
          }
          else {
              $window.localStorage.removeItem('token');
          }

      };
      authtokenfactory.getToken=function () {
          return $window.localStorage.getItem('token');
      };
      return authtokenfactory;
  })