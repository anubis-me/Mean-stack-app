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
       // auth.facebook(token);
        authfactory.facebook=function (token) {
            AuthToken.setToken(token);
        }
        authfactory.getUser=function () {
          if(AuthToken.getToken()){
              return $http.post('/api/me');
          }
          else {
              $q.reject({message:'User has no token'});
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

.factory('AuthInterceptors',function (AuthToken) {
    var authInterceptorsFactory={};
    authInterceptorsFactory.request = function (config) {
        var token = AuthToken.getToken();
        if(token) config.headers['x-access-token']=token;
        return config;
    };
    return authInterceptorsFactory;
});