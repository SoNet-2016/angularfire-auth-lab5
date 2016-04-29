## Pizza++ with Firebase (AngularFire) ##

1. Add the Firebase and AngularFire libraries to `index.html`.
    ```
    <script src="https://cdn.firebase.com/js/client/2.2.4/firebase.js"></script>
    <script src="https://cdn.firebase.com/libs/angularfire/1.2.0/angularfire.min.js"></script>
    ```

2. Add `'firebase'` as an app level module dependency.

2. Create a new Firebase app instance (on [http://firebase.com](http://firebase.com)).

3. Store the Firebase instance address into a constant (in `app.js`).
    ```
    angular.module(...).constant('FBURL', 'vivid-inferno-8565.firebaseio.com')
    ```

4. Structure the JSON data in the just created Firebase app. Delete the `data` folder from the project.

5. Edit the `Pizza` service to get all pizzas from the Firebase app instance.
    ```
    angular.module(...).factory('Pizza', function pizzaService(FBURL, $firebaseArray) {
        var ref = new Firebase(FBURL + '/pizzas');
        return {
            getPizzas: function() {
                return $firebaseArray(ref);
            }
        }
    });
    ```

6. Call the `getPizzas()` function from the `pizza-list.js` controller instead of the "old" service.

7. Update the `pizza-list.html` view to generate links with the built-in `$id` instead of the self-declared `id`.

8. Update the `Pizza` service to get single pizza information from the Firebase app instance.
    ```
    angular.module(...).factory('Pizza', function pizzaService(FBURL, $firebaseArray, $firebaseObject) {
       var ref = new Firebase(FBURL + '/pizzas');
       return {
           ...
           getPizza: function(id) {
               var pizzaRef = new Firebase(FBURL + '/pizzas/' + id);
               return $firebaseObject(pizzaRef);
           }
       }
    });
    ```

9. Consequently, call the `getPizza()` function from the `pizza-detail.js` controller.
