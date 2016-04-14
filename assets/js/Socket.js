angular.module('etwit')
    .factory('Socket', ['$window', 'apiBaseUrl', function($window, apiBaseUrl) {
        var def = new jQuery.Deferred(),
            user;

        if ($window.localStorage.user || $window.sessionStorage.user) {
            user = JSON.parse($window.localStorage.user || $window.sessionStorage.user);
        }

        if (user) {
            var socket = io.connect(apiBaseUrl + ':443/?token=' + user.access_token, {secure: true});

            socket.on('connect', function() {
                def.resolve(socket);
            });

            socket.on('error', function() {
                console.log('socket error', arguments);
            });

            return {
                emit: function(event) {
                    def.done(function(socket) {
                        if (socket.connected) {
                            socket.emit(event);
                        }
                    })
                },
                on: function(event, callback) {
                    def.done(function(socket) {
                        if (socket.connected) {
                            socket.on(event, callback);
                        }
                    });
                },
                close: function() {
                    def.done(function(socket) {
                        if (socket.connected) {
                            socket.close();
                        }
                    });
                }
            }
        } else {
            return null;
        }
    }]);