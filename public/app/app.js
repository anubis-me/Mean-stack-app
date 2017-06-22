angular.module('userApp',['appRoutes','usercontrollers','userservices','ngAnimate','maincontroller','authservices'])
.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});