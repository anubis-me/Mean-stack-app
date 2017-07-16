var app = angular.module('appRoutes',['ngRoute'])

    .config(function ($routeProvider,$locationProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'app/views/pages/home.html'
            })
            .when('/about', {
                templateUrl: 'app/views/pages/about.html'
            })
            .when('/register',{
                templateUrl:'app/views/pages/users/register.html',
                controller:'regctrl',
                controllerAs:'register',
                authenticated:false
            })
            .when('/login',{
                templateUrl:'app/views/pages/users/login.html',
                authenticated:false
            })
            .when('/logout',{
                templateUrl:'app/views/pages/users/logout.html',
                authenticated:true
            })
            .when('/profile',{
                templateUrl:'app/views/pages/users/profile.html',
                authenticated:true
            })
            .when('/facebookerror',{
                templateUrl:'app/views/pages/users/login.html',
                controller:'facebookCtrl',
                controllerAs:'facebook',
                authenticated:false
            })
            .when('/facebook/:token',{
                templateUrl:'app/views/pages/users/social/social.html',
                controller:'facebookCtrl',
                controllerAs:'facebook',
                authenticated:false
            })
            .when('/twitter/:token',{
                templateUrl:'app/views/pages/users/social/social.html',
                controller:'twitterCtrl',
                controllerAs:'twitter',
                authenticated:false
            })
            .when('/twittererror',{
                templateUrl:'app/views/pages/users/login.html',
                controller:'twitterCtrl',
                controllerAs:'twitter',
                authenticated:false
            })
            .when('/google/:token',{
                templateUrl:'app/views/pages/users/social/social.html',
                controller:'googleCtrl',
                controllerAs:'google',
                authenticated:false
            })
            .when('/googleerror',{
                templateUrl:'app/views/pages/users/login.html',
                controller:'googleCtrl',
                controllerAs:'google',
                authenticated:false
            })

            .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode({
            enabled:true,
            requireBase:false
        });
    });

app.run(['$rootScope','auth','$location',function ($rootScope,auth,$location) {
    $rootScope.$on('$routeChangeStart',function (event,next,current) {
        if(next.$$route.authenticated==true){
            if(!auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/');
            }
        }
        else if (next.$$route.authenticated==false){
            if(auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/profile');
            }
        }

    });
}]);

