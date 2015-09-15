var app = angular.module("sYnthesYs", ['ngRoute', 'firebase']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/home', {
            templateUrl: './app/templates/home.html',
            controller: 'HomeCtrl'
            
        }).
        otherwise({
            redirectTo: '/home'
        });
}]);