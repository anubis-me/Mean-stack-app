
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
    })

    .controller('facebookCtrl',function ($routeParams,$window,auth,$location) {
        var app=this;
        if($window.location.pathname=='/facebookerror'){
            app.errorMsg="facebook email not found in database";
        }
        else{
            auth.facebook($routeParams.token);
            $location.path('/');
        }

    })
    .controller('googleCtrl',function($routeParams,auth,$location,$window) {
        var app = this;
        if($window.location.pathname=='/googleerror'){
            app.errorMsg="Google email not found in database";
        }
        else{
            auth.facebook($routeParams.token);
            $location.path('/');
        }
    })

.controller('twitterCtrl',function ($routeParams,$window,auth,$location) {
    var app=this;
    if($window.location.pathname=='/twittererror'){
        app.errorMsg="Twitter email not found in database";
    }
    else{
        auth.facebook($routeParams.token);
        $location.path('/');
    }

});