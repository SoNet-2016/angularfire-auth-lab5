'use strict';

angular.module('pizzApp.pizza.list', ['ngRoute', 'pizzApp.pizza'])

// Route Config
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/pizzas', {
        templateUrl: 'pizza-list/pizza-list.html',
        controller: 'PizzaListCtrl',
        resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in app.js
            'currentAuth': ['Auth', function(Auth) {
                // $requireAuth returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError
                return Auth.$requireAuth();
            }]
        }
    });
}])

// Controller
.controller('PizzaListCtrl', ['$scope', 'Pizza',
    function($scope, Pizza) {
        $scope.pizzas = Pizza.getPizzas();
        $scope.orderProp = 'id';
}]);