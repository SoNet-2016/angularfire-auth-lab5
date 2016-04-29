'use strict';

angular.module('pizzApp.pizza.details', ['ngRoute', 'pizzApp.pizza'])

// Route Config    
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/pizzas/:pizzaId', {
        templateUrl: 'pizza-detail/pizza-detail.html',
        controller: 'PizzaDetailCtrl',
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
.controller('PizzaDetailCtrl', ['$scope', '$routeParams', 'Pizza',
    function($scope, $routeParams, Pizza) {
        $scope.pizza = Pizza.getPizza($routeParams.pizzaId);
}]);