angular.module('maincontroller',['authservices'])
.controller('mainctrl',function (auth, $timeout, $location,$rootScope,$window) {
    var app=this;

    app.loadme=false;
    $rootScope.$on('$routeChangeStart',function () {

        if(auth.isLoggedIn()){
            app.isLoggedIn=true;
            auth.getUser().then(function (data) {
                console.log(data.data.username);
                app.username=data.data.username;
                app.useremail=data.data.email;
                app.loadme=true;
            });
        }
        else{
            app.isLoggedIn=false;
            app.username='';
            app.loadme=true;
        }
        if($location.hash()=='_=_') $location.hash(null);
    });
    this.facebook=function () {
        $window.location=$window.location.protocol +'//'+ $window.location.host +'/auth/facebook';
    }
    this.doLogin= function (logindata) {
        app.errorMsg=false;
        app.loading=true;

        auth.login(app.logindata).then(function(data) {

            if(data.data.success){
                app.loading=false;
                app.successMsg = data.data.message+'....Redirecting';

                $timeout(function () {
                        $location.path('/about');
                        app.logindata='';
                        app.successMsg=false;
                     },2000);
            }
            else{
                app.loading=false;
                app.errorMsg=data.data.message;
            }
        });


    };
    this.logout=function () {
        auth.logout();
        $location.path('/logout');
        $timeout(function () {
            $location.path('/')
        },2000);
    };
});