## Autenticazione con AngularJS + Firebase ##

1. Se non ne abbiamo già uno, creiamo un account su Firebase

2. Entriamo nel nostro account Firebase e creiamo una nuova app:

    Ad esempio:
    * Nome: SoNet FB Auth
    * App url: sonet-fb-auth

3. Clicchiamo su Manage App per entrare nella configurazione dell'app appena creata.

4. Importiamo la struttura dati pizzas usando il file disponibile al seguente indirizzo:
  http://elite.polito.it/files/courses/01QYAPD/2016/social-prototype/social-prototype-fb-export.json

5. Abilitiamo l'autenticazione tramite nome utente e password andando nella giusta sezione:
  Login &amp; Auth -> Email &amp; Password

6. Scorrendo la pagina inseriamo una nostra email e password nella sezione "Registered Users".

7. Creiamo una regola di sicurezza per permette di accedere alla struttura dati solo dopo che l'utente ha effettuato l'autenticazione.
    ```
    {
        "rules": {
          "pizzas" : {
            ".read": "auth !== null",
            ".write": "auth !== null"
          }
        }
    }
    ```

    (per maggiori dettagli vedere il punto `User-Based Security` della documentazione [Documentazione-autenticazione](https://www.firebase.com/docs/web/libraries/angular/guide/user-auth.html) )

8. Prendiamo nota dell'indirizzo dell'app appena creata e chiudiamo il sito di Firebase.

9.  Apriamo WebStorm e cloniamo il progetto "social-prototype-firebase" dall'indirizzo [https://github.com/SoNet-2016/social-prototype-firebase](https://github.com/SoNet-2016/social-prototype-firebase)

10. Apriamo lo script app.js e modifichiamo l'indirizzo di firebase contenuto nella costante `FBURL`: inseriamo l'indirizzo dell'app appena creata.
    ```
    angular.module(...).constant('FBURL', 'sonet-fb-auth.firebaseio.com')
    ```
11. Seguiamo le istruzioni contenute nella documentazione ufficiale: [Documentazione-autenticazione](https://www.firebase.com/docs/web/libraries/angular/guide/user-auth.html)

12. Facciamo injection del servizio `$firebaseAuth` all'interno del modulo `pizzApp` (definito in app.js) e otteniamo lo stato dell'autenticazione

    ```
    angular.module(...).factory("Auth", ["$firebaseAuth", "FBURL",
        function($firebaseAuth, FBURL) {
            var ref = new Firebase(FBURL);
            return $firebaseAuth(ref);
        }
    ]);
    ```

13. Aggiungiamo il seguente blocco `run` al modulo `pizzApp` (definito in app.js)

    ```
    .run(["$rootScope", "$location", function($rootScope, $location) {
        $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
            // We can catch the error thrown when the $requireAuth promise is rejected
            // and redirect the user back to the home page
            if (error === "AUTH_REQUIRED") {
                $location.path("/login");
            }
        });
    }]);
    ```

    Un blocco run viene eseguito dopo che l'injector è stato creato. Esso viene usato per eseguire operazioni all' "avvio" dell'app ed in questo caso lo usiamo per verificare se l'utente è già loggato e, se non lo è, per reindirizzarlo verso la pagina di login (non ancora creata).

14. Modifichiamo il blocco "config" del modulo `pizzApp.pizza.list` (definito in pizza-list.js) in questo modo:

    ```
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
    ```

    Il codice riportato fa in modo che il controller non venga caricato (e quindi che l'utente venga rimandato al login) quando l'autenticazione non è ancora stata effettuata.

15. Modifichiamo il blocco "config" del modulo `pizzApp.pizza.details` (definito in pizza-detail.js) in questo modo:

        ```
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
        ```

        Il codice riportato fa in modo che il controller non venga caricato (e quindi che l'utente venga rimandato al login) quando l'autenticazione non è ancora stata effettuata.

16. Creiamo la pagina di login seguendo i seguenti passi:
  * creiamo la cartella `login`
  * creiamo la view in login.html. Tale view deve contenere:
     1. 2 text box per inserire nome utente (email firebase) e password,
     2. un bottone per confermare l'inserimento,
     3. un campo per stampare gli eventuali errori.

     Inoltre, usiamo le direttive di AngularJS per collegare il modello dati al controller (esempio: ng-model="user.email")
      ```
      <div class="alert alert-danger alert-dismissible" role="alert" ng-if="error">Login failed! {{ error }}</div>

      <form id="frmLogin" role="form" ng-submit="login()">
          <h2>Login</h2>

          <div class="form-group">
              <label for="txtEmail">Email address</label>
              <input type="email" class="form-control" id="txtEmail" placeholder="Enter email" name="email" ng-model="user.email" />
          </div>
          <div class="form-group">
              <label for="txtPass">Password</label>
              <input type="password" class="form-control" id="txtPass" placeholder="Password" name="password" ng-model="user.password" />
          </div>
          <button type="submit" class="btn btn-success center-block">Login</button>
      </form>
      ```

  * creiamo lo script `login.js` e creiamo il modulo `login`.

     Il controller del modulo deve:
     1. verificare che l'autenticazione non sia stata già effettuata,
     2. effettuare il login utilizzando il metodo `authWithPassword` a cui passeremo la struttura dati contenuta nello $scope (collegata con la View e contenente email e password per il login):

      ```
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

      ```
  * inseriamo il riferimento al modulo `pizzApp.login` in app.js
  * inseriamo i riferimenti al nuovo modulo in index.html:
      ```
        <script src="login/login.js"></script>
      ```
      