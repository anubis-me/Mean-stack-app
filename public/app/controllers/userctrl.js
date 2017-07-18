
angular.module('usercontrollers',['userservices'])
    .controller('regctrl',function ($http,$location,$timeout,user) {
        var app=this;
           this.reguser= function (regdata,valid) {
           app.errorMsg=false;
           app.loading=true;

        if(valid){
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
        }
        else {
            app.loading=false;
            app.errorMsg='Please ensure form is filled out correctly.';
          }
       };


        this.checkUsername=function(regdata) {

            app.checkingUsername=true;
            app.usernameMsg     =false;
            app.usernameInvalid =false;

            user.checkUsername(app.regdata).then(function(data) {

                if(data.data.success){
                    app.checkingUsername=false;
                    app.usernameMsg=data.data.message;
                }
                else {
                    app.usernameInvalid=true;
                    app.usernameMsg=data.data.message;
                }
            });
        }

        this.checkEmail=function(regdata) {

            app.checkingEmail =true;
            app.emailMsg      =false;
            app.emailInvalid  =false;

            user.checkEmail(app.regdata).then(function(data) {

                if(data.data.success){
                    app.checkingEmail   = false;
                    app.emailMsg        =  data.data.message;
                    app.emailInvalid    =false;
                }
                else {
                    app.checkingEmail   =false;
                    app.emailInvalid    =true;
                    app.emailMsg        =data.data.message;
                }
            });
        }

    })

    .directive('match',function () {
        return{
            restrict:'A',
            controller:function($scope){

                $scope.confirmed=false;
                $scope.doConfirm=function (values) {
                    values.forEach(function (ele) {
                        if($scope.confirm==ele){
                            $scope.confirmed=true;
                        }
                        else{
                            $scope.confirmed=false;
                        }
                    });
                }
            },

            link: function (scope,element,attrs) {
                attrs.$observe('match',function () {
                    scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                });
                scope.$watch('confirm',function () {
                    scope.matches = JSON.parse(attrs.match);
                    scope.doConfirm(scope.matches);
                });
            }

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