angular.module('etwit')
    .factory('UserAuth', ['$http', '$location', '$window', 'Socket', 'apiBaseUrl',
        function($http, $location, $window, Socket, apiBaseUrl) {
            var currentUser = null
                , onlineTimeoutId = null;

            return {
                login: function(username, password, remember) {
                    return $http.post(apiBaseUrl + '/auth/get-token', {
                        username: username,
                        password: password
                    })
                    .success(function(user) {
                        if (remember) {
                            $window.localStorage.user = JSON.stringify(currentUser = user);
                            delete $window.sessionStorage.user;
                        } else {
                            $window.sessionStorage.user = JSON.stringify(currentUser = user);
                            delete $window.localStorage.user;
                        }
                    })
                    .error(function() {
                        delete $window.localStorage.user;
                        delete $window.sessionStorage.user;
                        currentUser = null;
                    });
                },
                logout: function() {
                    delete $window.localStorage.user;
                    delete $window.sessionStorage.user;
                    currentUser = null;
                    Socket.close();
                    $location.path('/login');
                },
                getCurrentUser: function() {
                    if (currentUser === null && ($window.localStorage.user || $window.sessionStorage.user)) {
                        currentUser = JSON.parse($window.localStorage.user || $window.sessionStorage.user);
                    }

                    // Для поддержания online статуса
                    if (onlineTimeoutId === null && currentUser !== null) {
                        onlineTimeoutId = $window.setInterval(function() {
                            Socket.emit('online');
                        }, 60000)
                    }

                    return currentUser;
                }
            };
        }
    ]);