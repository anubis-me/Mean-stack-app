angular.module('appRoutes',['ngRoute'])

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
                controllerAs:'register'
            })
            .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode({
            enabled:true,
            requireBase:false
        });
    });