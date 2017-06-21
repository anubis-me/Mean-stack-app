angular.module('maincontroller',['authservices'])
.controller('mainctrl',function (auth, $timeout, $location) {
    var app=this;
    if(auth.isLoggedIn()){
        console.log('succcess');
    }
    else{
        console.log('failure');
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