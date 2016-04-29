'use strict';

angular.module('pizzApp.pizza.service', [])

.factory('Pizza', function(FBURL, $firebaseArray, $firebaseObject) {
    var ref = new Firebase(FBURL + '/pizzas');
    return {
        getPizzas: function() {
            return $firebaseArray(ref);
        },
        getPizza: function(id) {
            var pizzaRef = new Firebase(FBURL + '/pizzas/' + id);
            return $firebaseObject(pizzaRef);
        }
    }
});