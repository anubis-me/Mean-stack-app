
angular.module('usercontrollers',['userservices'])
    .controller('regctrl',function ($http,$location,$timeout,user) {
        var app=this;
           this.reguser= function (regdata) {
           app.errorMsg=false;
           app.loading=true;

        user.create(app.regdata).then(function(data) {

              if(data.data.success){
                  app.loading=false;
                  app.successMsg = data.data.message+'....Redirecting';
                  $timeout(function () {
                      $location.path('/');
                  },2000);

              }
              else{
                  app.loading=false;
                  app.errorMsg=data.data.message;
              }
           });
       };
    });