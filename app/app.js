'use strict';

// Declare app level module which depends on views, and components
angular.module('pizzApp', [
    'ngRoute',
    'ui.bootstrap',
    'firebase',
    'pizzApp.login',
    'pizzApp.pizza.list',
    'pizzApp.pizza.details',
    'pizzApp.pizza',
    'pizzApp.navigation'
])



// Config
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/pizzas'});
}])
//TODO insert the Firebase address
.constant('FBURL', 'social-prototype-fb.firebaseio.com')

.factory("Auth", ["$firebaseAuth", "FBURL",
    function($firebaseAuth, FBURL) {
        var ref = new Firebase(FBURL);
        return $firebaseAuth(ref);
    }
])
.run(["$rootScope", "$location", function($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
        // We can catch the error thrown when the $requireAuth promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
            $location.path("/login");
        }
    });
}]);