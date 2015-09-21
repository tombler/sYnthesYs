var app = angular.module("sYnthesYs", ['ngRoute', 'firebase', 'ui.bootstrap', 'ngDraggable']);

app

.factory("storage", function () {
    var bucket = {};
    var context = new AudioContext();
    var masterGain = context.createGain();

    return {
        context: context,
        gain: masterGain,
        getJunk: function (junk) {
            if (bucket.hasOwnProperty(junk)) {
                return bucket[junk];
            }
        },
        addJunk: function (key, value) {
            bucket[key] = value;
        }
    };
})

.run(['storage', function(storage) {

}])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/home', {
            templateUrl: './app/templates/home.html',
            controller: 'HomeCtrl'
            
        }).
        when('/custom', {
            templateUrl: './app/templates/customSound.html',
            controller: 'CustomSoundCtrl'
            
        }).
        when('/dj', {
            templateUrl: './app/templates/dj.html',
            controller: 'DjCtrl'
            
        }).
        otherwise({
            redirectTo: '/home'
        });
}]);