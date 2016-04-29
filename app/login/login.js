'use strict';

angular.module('pizzApp.login', ['ngRoute'])

// Route Config
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'login/login.html',
        controller: 'LoginCtrl'
    });
}])


// Controller
    .controller('LoginCtrl', ['$scope', 'Auth', '$location', '$log',
        function($scope, Auth, $location, $log) {
            $scope.auth = Auth; //acquires authentication from app.js (if it was done)


            // Function: login
            $scope.login = function() {
                $scope.error = null;

                // try to login with the given mail and password
                $scope.auth.$authWithPassword($scope.user).then(function() {
                    // login successful: redirect to the pizza list
                    $location.path("/pizzas");
                }).catch(function(error) {
                    // print and log the error
                    $scope.error = error.message;
                    $log.error(error.message);
                });
            };
        }]);
